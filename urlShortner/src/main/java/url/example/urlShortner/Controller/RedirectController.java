package url.example.urlShortner.Controller;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import url.example.urlShortner.Model.UrlMapping;
import url.example.urlShortner.Services.UrlMappingService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@AllArgsConstructor
public class RedirectController {
    private UrlMappingService urlMappingService;
    @GetMapping("/{shortUrl}")
    public ResponseEntity<Void> redirect(@PathVariable String shortUrl, HttpServletRequest request){
        UrlMapping urlMapping = urlMappingService.getOriginalUrl(shortUrl, request);
        if (urlMapping != null) {
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.add("Location", urlMapping.getOriginalUrl());
            return ResponseEntity.status(302).headers(httpHeaders).build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
