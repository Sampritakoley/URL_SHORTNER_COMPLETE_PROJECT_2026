package url.example.urlShortner.DTOs.Analytics;

import lombok.Data;
import java.util.List;

@Data
public class LinkAnalyticsResponse {
    private LinkDetails linkDetails;
    private LinkSummary summary;
    private LinkTrends trends;
    private List<LatestEvent> latestEvents;
    private List<UtmBreakdown> utmBreakdown;
    private TopMetrics topMetrics;

    @Data public static class LinkDetails {
        private String shortUrl;
        private String originalUrl;
    }
    @Data public static class LinkSummary {
        private long totalClicks;
        private long clickThrough;
        private long uniqueVisitors;
        private double bounceRate;
    }
    @Data public static class LinkTrends {
        private List<TrendData> clicksOverTime;
        @Data public static class TrendData {
            private String time;
            private long clicks;
        }
    }
    @Data public static class LatestEvent {
        private String timestamp;
        private String location;
        private String countryCode;
        private String device;
        private String referrer;
        private String os;
    }
    @Data public static class UtmBreakdown {
        private String param;
        private String value;
        private long clicks;
    }
    @Data public static class TopMetrics {
        private List<Metric> countries;
        private List<Metric> referrers;
        private List<Metric> devices;
        
        @Data public static class Metric {
            private String name;
            private String code;
            private double percentage;
        }
    }
}
