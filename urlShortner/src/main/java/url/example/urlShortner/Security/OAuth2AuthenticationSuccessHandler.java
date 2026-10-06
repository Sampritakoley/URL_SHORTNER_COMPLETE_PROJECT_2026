package url.example.urlShortner.Security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import url.example.urlShortner.Services.RefreshTokenService;
import url.example.urlShortner.Services.UserDetailsImpl;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        if (authentication.getPrincipal() instanceof UserDetailsImpl userDetails) {
            // Issue internal access token (15 mins) & refresh token (7 days)
            String accessToken = jwtUtils.generateAccessToken(userDetails);
            String refreshToken = refreshTokenService.createRefreshToken(userDetails.getEmail());

            // Set HttpOnly, Secure, SameSite=Lax cookies
            ResponseCookie accessCookie = jwtUtils.createAccessTokenCookie(accessToken);
            ResponseCookie refreshCookie = jwtUtils.createRefreshTokenCookie(refreshToken);

            response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
            response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

            String targetUrl = frontendUrl.endsWith("/") ? frontendUrl + "dashboard" : frontendUrl + "/dashboard";
            getRedirectStrategy().sendRedirect(request, response, targetUrl);
        } else {
            super.onAuthenticationSuccess(request, response, authentication);
        }
    }
}
