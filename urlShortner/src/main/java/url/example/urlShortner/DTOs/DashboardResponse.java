package url.example.urlShortner.DTOs;

import lombok.Data;

import java.util.List;
@Data
public class DashboardResponse {
    private long totalLinks;
    private long totalClicks;
    private String mostPopularLink;
    private List<LinkDto> recentLinks;

    // getters & setters

    public long getTotalLinks() {
        return totalLinks;
    }

    public void setTotalLinks(long totalLinks) {
        this.totalLinks = totalLinks;
    }

    public long getTotalClicks() {
        return totalClicks;
    }

    public void setTotalClicks(long totalClicks) {
        this.totalClicks = totalClicks;
    }

    public String getMostPopularLink() {
        return mostPopularLink;
    }

    public void setMostPopularLink(String mostPopularLink) {
        this.mostPopularLink = mostPopularLink;
    }

    public List<LinkDto> getRecentLinks() {
        return recentLinks;
    }

    public void setRecentLinks(List<LinkDto> recentLinks) {
        this.recentLinks = recentLinks;
    }
}
