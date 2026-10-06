package url.example.urlShortner;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import url.example.urlShortner.Model.User;
import url.example.urlShortner.Repository.UserRepository;
import url.example.urlShortner.Security.JwtUtils;
import url.example.urlShortner.Services.CustomOidcUserService;
import url.example.urlShortner.Services.UserDetailsImpl;



import java.time.Instant;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class OAuth2IntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomOidcUserService customOidcUserService;

    @MockBean
    private StringRedisTemplate redisTemplate;

    @MockBean
    private ValueOperations<String, String> valueOperations;

    @BeforeEach
    void setUp() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void testProtectedRouteReturns401WithoutAuth() throws Exception {
        mockMvc.perform(get("/api/myurls"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user@example.com", roles = {"USER"})
    void testAdminRouteReturns403ForUserRole() throws Exception {
        mockMvc.perform(get("/api/auth/admin/metrics"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testUnverifiedEmailRejected() {
        OidcUserRequest mockUserRequest = mock(OidcUserRequest.class);

        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", "google-unverified-1");
        claims.put("email", "unverified@example.com");
        claims.put("email_verified", false);
        claims.put("name", "Unverified User");

        OidcIdToken idToken = new OidcIdToken(
                "token-value",
                Instant.now(),
                Instant.now().plusSeconds(3600),
                claims
        );

        OidcUser oidcUser = new DefaultOidcUser(Collections.emptyList(), idToken);

        CustomOidcUserService serviceSpy = new CustomOidcUserService() {
            @Override
            public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
                Map<String, Object> attributes = oidcUser.getAttributes();
                Boolean emailVerified = (Boolean) attributes.get("email_verified");
                if (emailVerified == null || !emailVerified) {
                    throw new OAuth2AuthenticationException("email_not_verified");
                }
                return oidcUser;
            }
        };

        assertThrows(OAuth2AuthenticationException.class, () -> {
            serviceSpy.loadUser(mockUserRequest);
        });
    }

    @Autowired
    private JwtUtils jwtUtils;

    @Test
    void testNewUserCreationViaOidc() throws Exception {
        String email = "newoidcuser_" + System.currentTimeMillis() + "@example.com";
        String sub = "google-sub-new-" + System.currentTimeMillis();

        User oidcUser = User.builder()
                .email(email)
                .username("Google New User")
                .name("Google New User")
                .authProvider("GOOGLE")
                .providerSubject(sub)
                .role("ROLE_USER")
                .build();
        userRepository.save(oidcUser);

        UserDetailsImpl userDetails = UserDetailsImpl.build(oidcUser);
        String jwtToken = jwtUtils.generateAccessToken(userDetails);

        mockMvc.perform(get("/api/myurls")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk());
    }


    @Test
    void testExistingUserAccountLinking() {
        String email = "existinglocal_" + System.currentTimeMillis() + "@example.com";
        String sub = "google-sub-linked-" + System.currentTimeMillis();

        User localUser = User.builder()
                .email(email)
                .username("existinglocal")
                .password("hashedpass")
                .authProvider("LOCAL")
                .role("ROLE_USER")
                .build();

        userRepository.save(localUser);

        Optional<User> userBefore = userRepository.findByEmail(email);
        assertTrue(userBefore.isPresent());
        assertEquals("LOCAL", userBefore.get().getAuthProvider());

        User user = userBefore.get();
        user.setAuthProvider("GOOGLE");
        user.setProviderSubject(sub);
        userRepository.save(user);

        Optional<User> userAfter = userRepository.findByAuthProviderAndProviderSubject("GOOGLE", sub);
        assertTrue(userAfter.isPresent());
        assertEquals(email, userAfter.get().getEmail());
    }

}

