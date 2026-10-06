package url.example.urlShortner.Controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import url.example.urlShortner.DTOs.LoginRequest;
import url.example.urlShortner.DTOs.RegisterRequest;
import url.example.urlShortner.DTOs.UserDto;
import url.example.urlShortner.Model.User;
import url.example.urlShortner.Security.JwtAuthenticationResponse;
import url.example.urlShortner.Security.JwtUtils;
import url.example.urlShortner.Services.RefreshTokenService;
import url.example.urlShortner.Services.UserDetailsImpl;
import url.example.urlShortner.Services.UserService;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private UserService userService;
    private JwtUtils jwtUtils;
    private RefreshTokenService refreshTokenService;

    @PostMapping("/public/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest){
        JwtAuthenticationResponse jwtResponse = userService.authenticateUser(loginRequest);
        User user = userService.findByUsername(loginRequest.getUsername());
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);

        String refreshToken = refreshTokenService.createRefreshToken(user.getEmail());

        ResponseCookie accessCookie = jwtUtils.createAccessTokenCookie(jwtResponse.getToken());
        ResponseCookie refreshCookie = jwtUtils.createRefreshTokenCookie(refreshToken);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(jwtResponse);
    }

    @PostMapping("/public/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest){
        User user = new User();
        registerRequest.setRole(Set.of("ROLE_USER"));
        user.setUsername(registerRequest.getUsername());
        user.setPassword(registerRequest.getPassword());
        user.setEmail(registerRequest.getEmail());
        user.setAuthProvider("LOCAL");
        user.setRole("ROLE_USER");
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        UserDetailsImpl userDetails;
        if (authentication.getPrincipal() instanceof UserDetailsImpl impl) {
            userDetails = impl;
        } else {
            String email = authentication.getName();
            User user = userService.findByUsername(email);
            userDetails = UserDetailsImpl.build(user);
        }

        UserDto userDto = userService.getUserDto(userDetails);
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (JwtUtils.REFRESH_TOKEN_COOKIE_NAME.equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken != null) {
            refreshTokenService.deleteRefreshToken(refreshToken);
        }

        ResponseCookie cleanAccess = jwtUtils.cleanAccessTokenCookie();
        ResponseCookie cleanRefresh = jwtUtils.cleanRefreshTokenCookie();

        SecurityContextHolder.clearContext();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cleanAccess.toString())
                .header(HttpHeaders.SET_COOKIE, cleanRefresh.toString())
                .body(Map.of("message", "Logged out successfully"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (JwtUtils.REFRESH_TOKEN_COOKIE_NAME.equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Refresh token missing"));
        }

        String email = refreshTokenService.getEmailFromRefreshToken(refreshToken);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid or expired refresh token"));
        }

        User user = userService.findByUsername(email);
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);

        String newAccessToken = jwtUtils.generateAccessToken(userDetails);
        ResponseCookie accessCookie = jwtUtils.createAccessTokenCookie(newAccessToken);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .body(Map.of("token", newAccessToken));
    }

    @GetMapping("/admin/metrics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminMetrics() {
        return ResponseEntity.ok(Map.of("status", "ok", "message", "Admin metrics accessed successfully"));
    }
}


