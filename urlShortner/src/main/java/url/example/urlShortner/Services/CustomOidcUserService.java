package url.example.urlShortner.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import url.example.urlShortner.Model.User;
import url.example.urlShortner.Repository.UserRepository;

import java.util.Map;
import java.util.Optional;

@Service
public class CustomOidcUserService extends OidcUserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        // Step 1: Validate ID Token signature, issuer, audience, expiry via standard OidcUserService
        OidcUser oidcUser = super.loadUser(userRequest);

        Map<String, Object> attributes = oidcUser.getAttributes();
        String sub = oidcUser.getSubject();
        String email = oidcUser.getEmail();
        Boolean emailVerified = getBooleanClaim(attributes, "email_verified");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");

        // Step 2: Reject users whose email_verified is false
        if (emailVerified == null || !emailVerified) {
            OAuth2Error oauth2Error = new OAuth2Error(
                    "email_not_verified",
                    "User email is not verified by identity provider.",
                    null
            );
            throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString());
        }

        // Step 3: Find or create local user
        User user = processOidcUser("GOOGLE", sub, email, name, picture);

        // Step 4: Wrap user as UserDetailsImpl (which implements OidcUser & UserDetails)
        UserDetailsImpl userDetails = UserDetailsImpl.build(user, attributes);
        userDetails.setIdToken(oidcUser.getIdToken());
        userDetails.setUserInfo(oidcUser.getUserInfo());

        return userDetails;
    }

    private User processOidcUser(String provider, String providerSubject, String email, String name, String picture) {
        // Primary lookup: (provider, provider_subject)
        Optional<User> userOptional = userRepository.findByAuthProviderAndProviderSubject(provider, providerSubject);

        if (userOptional.isPresent()) {
            User existingUser = userOptional.get();
            existingUser.setName(name != null ? name : existingUser.getName());
            existingUser.setPicture(picture != null ? picture : existingUser.getPicture());
            return userRepository.save(existingUser);
        }

        // Secondary lookup by email
        Optional<User> userByEmail = userRepository.findByEmail(email);
        if (userByEmail.isPresent()) {
            // Link to existing local account since email matches AND email_verified is true
            User existingAccount = userByEmail.get();
            existingAccount.setAuthProvider(provider);
            existingAccount.setProviderSubject(providerSubject);
            if (name != null) existingAccount.setName(name);
            if (picture != null) existingAccount.setPicture(picture);
            return userRepository.save(existingAccount);
        }

        // Create new user with default ROLE_USER
        User newUser = User.builder()
                .email(email)
                .username(name != null ? name : email)
                .name(name)
                .picture(picture)
                .authProvider(provider)
                .providerSubject(providerSubject)
                .password(null)
                .role("ROLE_USER")
                .build();

        return userRepository.save(newUser);
    }

    private Boolean getBooleanClaim(Map<String, Object> attributes, String claimName) {
        Object val = attributes.get(claimName);
        if (val instanceof Boolean b) {
            return b;
        } else if (val instanceof String s) {
            return Boolean.parseBoolean(s);
        }
        return false;
    }
}
