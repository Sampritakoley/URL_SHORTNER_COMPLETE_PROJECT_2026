package url.example.urlShortner.DTOs.Analytics;

import lombok.Data;
import java.util.List;

@Data
public class GlobalAnalyticsResponse {
    private GlobalSummary summary;
    private GlobalTrends trends;
    private List<RecentActivity> recentActivity;
    private List<TopReferrer> topReferrers;

    @Data public static class GlobalSummary {
        private long totalClicks;
        private long activeLinks;
        private double avgCtr;
        private double conversion;
    }
    @Data public static class GlobalTrends {
        private List<TrendData> clicksOverTime;
        
        @Data public static class TrendData {
            private String date;
            private long clicks;
            private long impressions;
        }
    }
    @Data public static class RecentActivity {
        private String shortUrl;
        private String location;
        private String device;
        private String time;
        private String browser;
    }
    @Data public static class TopReferrer {
        private String name;
        private double percentage;
        private String trend;
    }
}
