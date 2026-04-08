package url.example.urlShortner.DTOs;

import lombok.Data;

import java.util.List;
@Data
public class DashboardResponse {
    private long totalLinks;
    private long totalClicks;
    private String mostPopularLink;
    private List<LinkDto> recentLinks;
    private int currentPage;
    private int totalPages;
    private long totalEvents;


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

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }
}


