package url.example.urlShortner.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import url.example.urlShortner.Model.ClickEvent;
import url.example.urlShortner.Model.UrlMapping;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ClickEventRepository extends JpaRepository<ClickEvent, Long> {
    List<ClickEvent> findByUrlMappingAndClickDateBetween(UrlMapping mapping, LocalDateTime startDate, LocalDateTime endDate);
    List<ClickEvent> findByUrlMappingInAndClickDateBetween(List<UrlMapping> urlMappings, LocalDateTime startDate, LocalDateTime endDate);
    org.springframework.data.domain.Page<ClickEvent> findByUrlMappingIn(List<UrlMapping> urlMappings, org.springframework.data.domain.Pageable pageable);
    List<ClickEvent> findByUrlMappingIn(List<UrlMapping> urlMappings);
    List<ClickEvent> findByUrlMapping(UrlMapping urlMapping);
}
