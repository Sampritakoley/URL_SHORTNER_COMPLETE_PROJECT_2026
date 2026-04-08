package url.example.urlShortner.Services;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.json.JSONObject;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import url.example.urlShortner.DTOs.ClickEventMessage;
import url.example.urlShortner.Model.ClickEvent;
import url.example.urlShortner.Model.UrlMapping;
import url.example.urlShortner.Repository.ClickEventRepository;
import url.example.urlShortner.Repository.UrlMappingRepository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@AllArgsConstructor
public class ClickEventKafkaConsumer {

    private final UrlMappingRepository urlMappingRepository;
    private final ClickEventRepository clickEventRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "click-events-topic", groupId = "url-shortener-group")
    public void consumeClickEvent(String message) {
        try {
            ClickEventMessage clickData = objectMapper.readValue(message, ClickEventMessage.class);

            urlMappingRepository.incrementClickCount(clickData.getUrlMappingId());

            UrlMapping urlMapping = urlMappingRepository.findById(clickData.getUrlMappingId()).orElse(null);
            if (urlMapping == null)
                return;

            ClickEvent clickEvent = new ClickEvent();
            clickEvent.setClickDate(LocalDateTime.now());
            clickEvent.setUrlMapping(urlMapping);

            clickEvent.setUtmSource(clickData.getUtmSource());
            clickEvent.setUtmMedium(clickData.getUtmMedium());
            clickEvent.setUtmCampaign(clickData.getUtmCampaign());

            String referer = clickData.getReferer();
            if (referer != null) {
                if (referer.contains("twitter.com") || referer.contains("t.co"))
                    clickEvent.setReferrer("Twitter / X");
                else if (referer.contains("linkedin.com"))
                    clickEvent.setReferrer("LinkedIn");
                else if (referer.contains("facebook.com"))
                    clickEvent.setReferrer("Facebook");
                else if (referer.contains("instagram.com"))
                    clickEvent.setReferrer("Instagram");
                else
                    clickEvent.setReferrer(referer);
            }

            String ip = clickData.getIp();
            Map<String, String> location = getLocationFromIP(ip);
            if (location != null) {
                clickEvent.setLocation(location.get("country"));
                clickEvent.setCountryCode(location.get("countryCode"));
            } else {
                clickEvent.setLocation("Unknown");
                clickEvent.setCountryCode("Unknown");
            }

            String userAgent = clickData.getUserAgent();
            if (userAgent != null) {
                if (userAgent.contains("Mobi") || userAgent.contains("Android"))
                    clickEvent.setDevice("Mobile");
                else if (userAgent.contains("Tablet") || userAgent.contains("iPad"))
                    clickEvent.setDevice("Tablet");
                else
                    clickEvent.setDevice("Desktop");

                if (userAgent.contains("Windows"))
                    clickEvent.setOs("Windows");
                else if (userAgent.contains("MacO"))
                    clickEvent.setOs("MacOS");
                else if (userAgent.contains("Linux"))
                    clickEvent.setOs("Linux");
                else if (userAgent.contains("Android"))
                    clickEvent.setOs("Android");
                else if (userAgent.contains("iPhone") || userAgent.contains("iPad"))
                    clickEvent.setOs("iOS");
                else
                    clickEvent.setOs("Unknown");

                if (userAgent.contains("Chrome"))
                    clickEvent.setBrowser("Chrome");
                else if (userAgent.contains("Firefox"))
                    clickEvent.setBrowser("Firefox");
                else if (userAgent.contains("Safari") && !userAgent.contains("Chrome"))
                    clickEvent.setBrowser("Safari");
                else if (userAgent.contains("Edge"))
                    clickEvent.setBrowser("Edge");
                else
                    clickEvent.setBrowser("Unknown");
            }

            clickEventRepository.save(clickEvent);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private Map<String, String> getLocationFromIP(String ip) {
        if (ip == null || ip.isEmpty() || "0:0:0:0:0:0:0:1".equals(ip) || "127.0.0.1".equals(ip)) {
            return null;
        }
        try {
            URL url = new URL("http://ip-api.com/json/" + ip);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(3000);
            conn.setReadTimeout(3000);

            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }

            JSONObject json = new JSONObject(response.toString());
            if ("fail".equals(json.optString("status"))) {
                return null;
            }

            Map<String, String> location = new HashMap<>();
            location.put("country", json.optString("country", "Unknown"));
            location.put("countryCode", json.optString("countryCode", "Unknown"));

            return location;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
