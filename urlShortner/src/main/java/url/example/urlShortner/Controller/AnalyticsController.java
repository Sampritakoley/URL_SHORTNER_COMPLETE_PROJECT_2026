package url.example.urlShortner.Controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import url.example.urlShortner.DTOs.Analytics.GlobalAnalyticsResponse;
import url.example.urlShortner.DTOs.Analytics.LinkAnalyticsResponse;
import url.example.urlShortner.DTOs.Analytics.LogsAnalyticsResponse;
import url.example.urlShortner.Model.User;
import url.example.urlShortner.Services.AnalyticsService;
import url.example.urlShortner.Services.UserDetailsImpl;
import url.example.urlShortner.Services.UserService;

import java.security.Principal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/analytics")
@AllArgsConstructor
public class AnalyticsController {

    private AnalyticsService analyticsService;
    private UserService userService;

    private User getUser(Principal principal) {
        UsernamePasswordAuthenticationToken authentication = (UsernamePasswordAuthenticationToken) principal;
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userService.findByUsername(userDetails.getEmail());
    }

    @GetMapping("/global")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GlobalAnalyticsResponse> getGlobalAnalytics(
            Principal principal,
            // Explicitly name the parameter and set required to false
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam(value = "filter", required = false) String filter) {

        User user = getUser(principal);

        LocalDate start = (startDate != null && !startDate.trim().isEmpty())
                ? LocalDate.parse(startDate)
                : LocalDate.now().minusDays(30);

        LocalDate end = (endDate != null && !endDate.trim().isEmpty())
                ? LocalDate.parse(endDate)
                : LocalDate.now();

        return ResponseEntity.ok(analyticsService.getGlobalAnalytics(user, start, end, filter));
    }

    @GetMapping("/logs")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<LogsAnalyticsResponse> getLogsAnalytics(
            Principal principal,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String device,
            @RequestParam(required = false) String location) {

        User user = getUser(principal);
        return ResponseEntity.ok(analyticsService.getLogsAnalytics(user, page, limit, search, device, location));
    }

    @GetMapping("/link/{shortId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<LinkAnalyticsResponse> getLinkAnalytics(
            Principal principal,
            @PathVariable String shortId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String device) {

        LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;

        LinkAnalyticsResponse response = analyticsService.getLinkAnalytics(shortId, start, end, location, device);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }
}
