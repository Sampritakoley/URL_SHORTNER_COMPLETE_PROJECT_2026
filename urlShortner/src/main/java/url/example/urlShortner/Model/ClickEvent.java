package url.example.urlShortner.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Entity
@Data
public class ClickEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime clickDate;
    
    private String location;
    private String countryCode;
    private String device;
    private String os;
    private String browser;
    private String referrer;
    
    private String utmSource;
    private String utmMedium;
    private String utmCampaign;

    @ManyToOne
    @JoinColumn(name="url_mapping_id")
    private UrlMapping urlMapping;
}
