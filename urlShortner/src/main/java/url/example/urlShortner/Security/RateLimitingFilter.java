package url.example.urlShortner.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS_PER_MINUTE = 30;

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Apply rate limiting specifically to auth endpoints
        if (path.startsWith("/api/auth")) {
            String clientIp = getClientIP(request);
            String key = "rate_limit:auth:" + clientIp;

            try {
                Long requests = redisTemplate.opsForValue().increment(key, 1);
                if (requests != null && requests == 1) {
                    redisTemplate.expire(key, 1, TimeUnit.MINUTES);
                }

                if (requests != null && requests > MAX_REQUESTS_PER_MINUTE) {
                    response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Too many authentication requests. Please try again in a minute.\"}");
                    return;
                }
            } catch (Exception e) {
                // If Redis is temporarily down, allow request to proceed without blocking login flow
                logger.warn("Redis rate limiter unavailable, bypassing filter: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
