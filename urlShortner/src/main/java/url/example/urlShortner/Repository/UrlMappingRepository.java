package url.example.urlShortner.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import url.example.urlShortner.Model.UrlMapping;
import url.example.urlShortner.Model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {
    UrlMapping findByShortUrl(String shortUrl);
    List<UrlMapping> findByUser(User user);

    long countByUserId(Long userId);

    @Query("SELECT COALESCE(SUM(u.clickCount),0) FROM UrlMapping u WHERE u.user.id = :userId")
    Long getTotalClicks(Long userId);

    Optional<UrlMapping> findTopByUserIdOrderByClickCountDesc(Long userId);

    List<UrlMapping> findTop5ByUserIdOrderByCreatedDateDesc(Long userId);
}
