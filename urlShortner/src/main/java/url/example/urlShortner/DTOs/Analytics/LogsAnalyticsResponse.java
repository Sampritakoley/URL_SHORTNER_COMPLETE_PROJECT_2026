package url.example.urlShortner.DTOs.Analytics;

import lombok.Data;
import java.util.List;

@Data
public class LogsAnalyticsResponse {
    private Pagination pagination;
    private QuickInsights quickInsights;
    private List<LogEntry> logs;

    @Data public static class Pagination {
        private long totalEvents;
        private int currentPage;
        private int totalPages;
        private int limit;
    }
    @Data public static class QuickInsights {
        private long totalEvents;
        private long uniqueVisitors;
        private String topSource;
    }
    @Data public static class LogEntry {
        private String shortUrl;
        private String originalUrl;
        private String location;
        private String countryCode;
        private String device;
        private String referrer;
        private String timestamp;
    }
}
