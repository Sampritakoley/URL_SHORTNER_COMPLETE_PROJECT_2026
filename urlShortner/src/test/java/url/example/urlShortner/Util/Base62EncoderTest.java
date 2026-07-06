package url.example.urlShortner.Util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Comprehensive unit tests for {@link Base62Encoder}.
 *
 * <p>Covers: encode/decode round-trip, edge cases, uniqueness,
 * error handling, and capacity validation.
 */
@DisplayName("Base62Encoder")
class Base62EncoderTest {

    // ──────────────────────────────────────────────────────────────
    // Encode Tests
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("encode()")
    class EncodeTests {

        @Test
        @DisplayName("should encode 0 to '0'")
        void encodeZero() {
            assertEquals("0", Base62Encoder.encode(0));
        }

        @Test
        @DisplayName("should encode 1 to '1'")
        void encodeOne() {
            assertEquals("1", Base62Encoder.encode(1));
        }

        @Test
        @DisplayName("should encode 61 to 'Z' (last single character)")
        void encodeSixtyOne() {
            // 61 is the last index in the Base62 alphabet → 'Z'
            assertEquals("Z", Base62Encoder.encode(61));
        }

        @Test
        @DisplayName("should encode 62 to '10' (first two-character code)")
        void encodeSixtyTwo() {
            // 62 in Base62 → '10' (like 10 in decimal = first two-digit number)
            assertEquals("10", Base62Encoder.encode(62));
        }

        @Test
        @DisplayName("should encode 12345 to a compact string")
        void encodeTwelveThousand() {
            String result = Base62Encoder.encode(12345);
            assertNotNull(result);
            assertFalse(result.isEmpty());
            // Verify round-trip
            assertEquals(12345, Base62Encoder.decode(result));
        }

        @Test
        @DisplayName("should encode Long.MAX_VALUE without error")
        void encodeLongMaxValue() {
            String result = Base62Encoder.encode(Long.MAX_VALUE);
            assertNotNull(result);
            // Long.MAX_VALUE in Base62 is 11 characters
            assertTrue(result.length() <= 11,
                    "Expected max 11 chars, got " + result.length() + ": " + result);
        }

        @Test
        @DisplayName("should throw IllegalArgumentException for negative ID")
        void encodeNegativeId() {
            IllegalArgumentException ex = assertThrows(
                    IllegalArgumentException.class,
                    () -> Base62Encoder.encode(-1)
            );
            assertTrue(ex.getMessage().contains("-1"));
        }

        @Test
        @DisplayName("should produce only URL-safe characters [0-9a-zA-Z]")
        void encodeProducesUrlSafeCharacters() {
            String result = Base62Encoder.encode(999_999_999L);
            assertTrue(result.matches("[0-9a-zA-Z]+"),
                    "Expected only URL-safe characters, got: " + result);
        }
    }

    // ──────────────────────────────────────────────────────────────
    // Decode Tests
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("decode()")
    class DecodeTests {

        @Test
        @DisplayName("should decode '0' back to 0")
        void decodeZero() {
            assertEquals(0, Base62Encoder.decode("0"));
        }

        @Test
        @DisplayName("should decode '10' back to 62")
        void decodeSixtyTwo() {
            assertEquals(62, Base62Encoder.decode("10"));
        }

        @Test
        @DisplayName("should throw IllegalArgumentException for null input")
        void decodeNull() {
            assertThrows(IllegalArgumentException.class,
                    () -> Base62Encoder.decode(null));
        }

        @Test
        @DisplayName("should throw IllegalArgumentException for empty string")
        void decodeEmpty() {
            assertThrows(IllegalArgumentException.class,
                    () -> Base62Encoder.decode(""));
        }

        @Test
        @DisplayName("should throw IllegalArgumentException for invalid characters")
        void decodeInvalidCharacters() {
            // '+' is not in the Base62 alphabet
            IllegalArgumentException ex = assertThrows(
                    IllegalArgumentException.class,
                    () -> Base62Encoder.decode("abc+def")
            );
            assertTrue(ex.getMessage().contains("+"));
        }

        @Test
        @DisplayName("should throw ArithmeticException for overflow input")
        void decodeOverflow() {
            // A very long Base62 string that would overflow Long
            assertThrows(ArithmeticException.class,
                    () -> Base62Encoder.decode("ZZZZZZZZZZZZZZZZ"));
        }
    }

    // ──────────────────────────────────────────────────────────────
    // Round-Trip Tests (encode → decode → original value)
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("Round-trip encode/decode")
    class RoundTripTests {

        @ParameterizedTest(name = "round-trip for id = {0}")
        @ValueSource(longs = {0, 1, 9, 10, 61, 62, 63, 100, 999, 12345,
                100_000, 1_000_000, 999_999_999, Long.MAX_VALUE})
        @DisplayName("should survive encode → decode round-trip for various IDs")
        void roundTripVariousIds(long id) {
            String encoded = Base62Encoder.encode(id);
            long decoded = Base62Encoder.decode(encoded);
            assertEquals(id, decoded,
                    "Round-trip failed: " + id + " → '" + encoded + "' → " + decoded);
        }
    }

    // ──────────────────────────────────────────────────────────────
    // Uniqueness Tests
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("Uniqueness")
    class UniquenessTests {

        @Test
        @DisplayName("should produce unique codes for 10,000 sequential IDs")
        void uniqueCodesForSequentialIds() {
            Set<String> codes = new HashSet<>();
            for (long i = 0; i < 10_000; i++) {
                String code = Base62Encoder.encode(i);
                assertTrue(codes.add(code),
                        "Duplicate code found: '" + code + "' for id=" + i);
            }
            assertEquals(10_000, codes.size());
        }

        @Test
        @DisplayName("different IDs should produce different codes")
        void differentIdsProduceDifferentCodes() {
            assertNotEquals(
                    Base62Encoder.encode(12345),
                    Base62Encoder.encode(12346)
            );
        }
    }

    // ──────────────────────────────────────────────────────────────
    // Capacity / Length Tests
    // ──────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("Code length / capacity")
    class CapacityTests {

        @Test
        @DisplayName("1 billion IDs should produce codes of 6 or fewer chars")
        void oneBillionFitsInSixChars() {
            // 62^6 = 56,800,235,584 > 1 billion
            String code = Base62Encoder.encode(1_000_000_000L);
            assertTrue(code.length() <= 6,
                    "Expected ≤6 chars for 1B, got " + code.length() + ": " + code);
        }

        @Test
        @DisplayName("codes should be compact — shorter than UUID")
        void shorterThanUuid() {
            String code = Base62Encoder.encode(999_999_999_999L);
            // UUID is 36 chars, our code should be far shorter
            assertTrue(code.length() < 36,
                    "Expected much shorter than UUID, got " + code.length() + " chars");
            // In fact, it should be ≤ 7 chars
            assertTrue(code.length() <= 7);
        }
    }
}
