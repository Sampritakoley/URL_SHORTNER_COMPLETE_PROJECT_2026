package url.example.urlShortner.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import url.example.urlShortner.DTOs.DashboardResponse;
import url.example.urlShortner.Model.User;
import url.example.urlShortner.Services.DashboardService;
import url.example.urlShortner.Services.UserDetailsImpl;
import url.example.urlShortner.Services.UserService;

import java.security.Principal;

@RestController
@RequestMapping("/api/url/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserService userService;

    @GetMapping
    public DashboardResponse getDashboard(
            Principal principal,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {

        Long userId;
        if (principal instanceof Authentication auth && auth.getPrincipal() instanceof UserDetailsImpl impl) {
            userId = impl.getId();
        } else {
            User user = userService.findByUsername(principal.getName());
            userId = user.getId();
        }

        return dashboardService.getDashboardData(userId, page, limit);
    }
}

