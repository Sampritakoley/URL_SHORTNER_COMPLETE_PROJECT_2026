package url.example.urlShortner.DTOs;

import lombok.Data;

import java.util.Set;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private Set<String> role=Set.of("ROLE_USER");
    private String password;
}
