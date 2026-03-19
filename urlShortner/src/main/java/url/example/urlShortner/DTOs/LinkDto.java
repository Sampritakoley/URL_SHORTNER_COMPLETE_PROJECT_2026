package url.example.urlShortner.DTOs;

import java.time.LocalDateTime;

public class LinkDto {
    private Long id;
    private String originalUrl;
    private String shortUrl;
    private int clicks;
    private LocalDateTime createdAt;

    public LinkDto(Long id, String originalUrl, String shortUrl, int clicks, LocalDateTime createdAt) {
        this.id = id;
        this.originalUrl = originalUrl;
        this.shortUrl = shortUrl;
        this.clicks = clicks;
        this.createdAt = createdAt;
    }

    // getters

    public Long getId() {
        return id;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public String getShortUrl() {
        return shortUrl;
    }

    public int getClicks() {
        return clicks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
