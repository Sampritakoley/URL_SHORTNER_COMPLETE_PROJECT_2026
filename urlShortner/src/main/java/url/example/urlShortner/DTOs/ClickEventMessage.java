package url.example.urlShortner.DTOs;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClickEventMessage {
    private Long urlMappingId;
    private String ip;
    private String userAgent;
    private String referer;
    private String utmSource;
    private String utmMedium;
    private String utmCampaign;
}
