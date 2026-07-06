package url.example.urlShortner.Services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import url.example.urlShortner.DTOs.UrlMappingDTO;
import url.example.urlShortner.Model.UrlMapping;
import url.example.urlShortner.Model.User;
import url.example.urlShortner.Repository.ClickEventRepository;
import url.example.urlShortner.Repository.UrlMappingRepository;
import url.example.urlShortner.Util.Base62Encoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link UrlMappingService#createShortUrl(String, User)}.
 *
 * <p>Verifies the two-save Base62 flow:
 * <ol>
 *   <li>First save → gets auto-generated ID from repository</li>
 *   <li>Base62-encode the ID</li>
 *   <li>Second save → persists the short URL</li>
 * </ol>
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UrlMappingService — Base62 Integration")
class UrlMappingServiceTest {

    @Mock
    private UrlMappingRepository urlMappingRepository;

    @Mock
    private ClickEventRepository clickEventRepository;

    @Mock
    private ClickEventProcessor clickEventProcessor;

    @InjectMocks
    private UrlMappingService urlMappingService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
    }

    @Test
    @DisplayName("createShortUrl should save twice — first to get ID, second to set Base62 shortUrl")
    void createShortUrl_shouldSaveTwice() {
        // Arrange: simulate PostgreSQL generating ID = 12345 on first save
        when(urlMappingRepository.save(any(UrlMapping.class)))
                .thenAnswer(invocation -> {
                    UrlMapping entity = invocation.getArgument(0);
                    if (entity.getId() == null) {
                        // First save: simulate auto-increment ID generation
                        entity.setId(12345L);
                    }
                    return entity;
                });

        // Act
        UrlMappingDTO result = urlMappingService.createShortUrl("https://example.com", testUser);

        // Assert: repository.save() called exactly twice
        verify(urlMappingRepository, times(2)).save(any(UrlMapping.class));

        // Assert: returned DTO has the correct Base62-encoded short URL
        String expectedShortUrl = Base62Encoder.encode(12345L);
        assertEquals(expectedShortUrl, result.getShortUrl());
    }

    @Test
    @DisplayName("createShortUrl should set Base62 encoded ID as shortUrl")
    void createShortUrl_shouldSetBase62EncodedShortUrl() {
        // Arrange: simulate ID = 1
        when(urlMappingRepository.save(any(UrlMapping.class)))
                .thenAnswer(invocation -> {
                    UrlMapping entity = invocation.getArgument(0);
                    if (entity.getId() == null) {
                        entity.setId(1L);
                    }
                    return entity;
                });

        // Act
        UrlMappingDTO result = urlMappingService.createShortUrl("https://google.com", testUser);

        // Assert: short URL should be Base62 of ID 1 → "1"
        assertEquals("1", result.getShortUrl());
    }

    @Test
    @DisplayName("createShortUrl should preserve originalUrl in the DTO")
    void createShortUrl_shouldPreserveOriginalUrl() {
        String originalUrl = "https://www.example.com/very/long/path?param=value";

        when(urlMappingRepository.save(any(UrlMapping.class)))
                .thenAnswer(invocation -> {
                    UrlMapping entity = invocation.getArgument(0);
                    if (entity.getId() == null) {
                        entity.setId(100L);
                    }
                    return entity;
                });

        UrlMappingDTO result = urlMappingService.createShortUrl(originalUrl, testUser);

        assertEquals(originalUrl, result.getOriginalUrl());
    }

    @Test
    @DisplayName("createShortUrl should set username from user entity")
    void createShortUrl_shouldSetUsername() {
        when(urlMappingRepository.save(any(UrlMapping.class)))
                .thenAnswer(invocation -> {
                    UrlMapping entity = invocation.getArgument(0);
                    if (entity.getId() == null) {
                        entity.setId(50L);
                    }
                    return entity;
                });

        UrlMappingDTO result = urlMappingService.createShortUrl("https://example.com", testUser);

        assertEquals("testuser", result.getUsername());
    }

    @Test
    @DisplayName("second save should contain the Base62 short URL on the entity")
    void createShortUrl_secondSaveShouldHaveShortUrl() {
        ArgumentCaptor<UrlMapping> captor = ArgumentCaptor.forClass(UrlMapping.class);

        when(urlMappingRepository.save(any(UrlMapping.class)))
                .thenAnswer(invocation -> {
                    UrlMapping entity = invocation.getArgument(0);
                    if (entity.getId() == null) {
                        entity.setId(999L);
                    }
                    return entity;
                });

        urlMappingService.createShortUrl("https://example.com", testUser);

        // Capture both save calls
        verify(urlMappingRepository, times(2)).save(captor.capture());

        // First save: shortUrl should be null (we haven't computed it yet)
        UrlMapping firstSave = captor.getAllValues().get(0);
        // Note: the same object reference is used, so by the time we inspect,
        // it already has the shortUrl set. We verify via the second capture instead.

        // Second save: shortUrl should be Base62-encoded
        UrlMapping secondSave = captor.getAllValues().get(1);
        String expectedShortUrl = Base62Encoder.encode(999L);
        assertEquals(expectedShortUrl, secondSave.getShortUrl());
    }

    @Test
    @DisplayName("createShortUrl should set createdDate to non-null")
    void createShortUrl_shouldSetCreatedDate() {
        when(urlMappingRepository.save(any(UrlMapping.class)))
                .thenAnswer(invocation -> {
                    UrlMapping entity = invocation.getArgument(0);
                    if (entity.getId() == null) {
                        entity.setId(1L);
                    }
                    return entity;
                });

        UrlMappingDTO result = urlMappingService.createShortUrl("https://example.com", testUser);

        assertNotNull(result.getCreatedDate());
    }

    @Test
    @DisplayName("createShortUrl with large ID should produce compact short URL")
    void createShortUrl_largeIdShouldProduceCompactUrl() {
        // Simulate a large ID (10 million)
        when(urlMappingRepository.save(any(UrlMapping.class)))
                .thenAnswer(invocation -> {
                    UrlMapping entity = invocation.getArgument(0);
                    if (entity.getId() == null) {
                        entity.setId(10_000_000L);
                    }
                    return entity;
                });

        UrlMappingDTO result = urlMappingService.createShortUrl("https://example.com", testUser);

        // 10M in Base62 should be ≤ 5 chars (62^5 = 916M)
        assertTrue(result.getShortUrl().length() <= 5,
                "Expected compact URL, got: " + result.getShortUrl());
        // Verify it decodes back
        assertEquals(10_000_000L, Base62Encoder.decode(result.getShortUrl()));
    }
}
