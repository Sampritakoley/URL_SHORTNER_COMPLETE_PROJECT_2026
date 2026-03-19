package url.example.urlShortner.Services;

import org.springframework.stereotype.Service;
import url.example.urlShortner.DTOs.DashboardResponse;
import url.example.urlShortner.DTOs.LinkDto;
import url.example.urlShortner.Model.UrlMapping;
import url.example.urlShortner.Repository.UrlMappingRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class DashboardService {
    private final UrlMappingRepository urlMappingRepository;

    public DashboardService(UrlMappingRepository urlMappingRepository) {
        this.urlMappingRepository = urlMappingRepository;
    }


    public DashboardResponse getDashboardData(Long userId) {

        DashboardResponse response = new DashboardResponse();

        // total links
        long totalLinks = urlMappingRepository.countByUserId(userId);

        // total clicks
        long totalClicks = urlMappingRepository.getTotalClicks(userId);

        // most popular link
        UrlMapping popular = urlMappingRepository
                .findTopByUserIdOrderByClickCountDesc(userId)
                .orElse(null);

        // recent links
        List<UrlMapping> recent = urlMappingRepository
                .findTop5ByUserIdOrderByCreatedDateDesc(userId);

        List<LinkDto> recentLinks = recent.stream()
                .map(link -> new LinkDto(
                        link.getId(),
                        link.getOriginalUrl(),
                        link.getShortUrl(),
                        link.getClickCount(),
                        link.getCreatedDate()
                ))
                .toList();

        response.setTotalLinks(totalLinks);
        response.setTotalClicks(totalClicks);
        response.setMostPopularLink(popular != null ? popular.getShortUrl() : null);
        response.setRecentLinks(recentLinks);

        return response;
    }
}
