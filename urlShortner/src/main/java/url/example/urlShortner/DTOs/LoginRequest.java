package url.example.urlShortner.DTOs;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
