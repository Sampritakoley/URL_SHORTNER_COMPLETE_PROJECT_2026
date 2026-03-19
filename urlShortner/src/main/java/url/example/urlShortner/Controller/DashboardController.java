package url.example.urlShortner.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import url.example.urlShortner.DTOs.DashboardResponse;
import url.example.urlShortner.Services.DashboardService;
import url.example.urlShortner.Services.UserDetailsImpl;

import java.security.Principal;

@RestController
@RequestMapping("/api/url/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public DashboardResponse getDashboard(Principal principal) {
        UsernamePasswordAuthenticationToken authentication =
                (UsernamePasswordAuthenticationToken) principal;

        UserDetailsImpl userDetails =
                (UserDetailsImpl) authentication.getPrincipal();

        Long userId = userDetails.getId();
        return dashboardService.getDashboardData(userId);
    }
}
