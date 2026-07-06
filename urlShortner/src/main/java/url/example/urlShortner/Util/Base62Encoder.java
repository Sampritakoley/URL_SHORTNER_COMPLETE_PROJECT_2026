package url.example.urlShortner.Util;

/**
 * Production-ready Base62 encoder/decoder for URL shortening.
 *
 * <p>Converts numeric IDs (from PostgreSQL auto-increment) into compact,
 * URL-safe short codes using the character set [0-9a-zA-Z].
 *
 * <h3>Design Decisions:</h3>
 * <ul>
 *   <li><b>Why Base62?</b> — Unlike Base64, it avoids '+', '/', '=' characters
 *       that require percent-encoding in URLs. Produces clean, human-readable codes.</li>
 *   <li><b>Bijective mapping</b> — Each unique long ID maps to exactly one unique string
 *       and vice versa. No collisions are possible.</li>
 *   <li><b>Stateless & thread-safe</b> — Pure functions with no shared mutable state.
 *       Safe for concurrent use without synchronization.</li>
 *   <li><b>No Spring dependency</b> — Plain utility class, easily testable and reusable
 *       across modules.</li>
 * </ul>
 *
 * <h3>Capacity:</h3>
 * <pre>
 *   7 chars → 62^7 = 3,521,614,606,208 (~3.5 trillion unique URLs)
 *   11 chars → covers Long.MAX_VALUE (9.2 × 10^18)
 * </pre>
 *
 * @author Senior Engineering Team
 * @since 1.0
 */
public final class Base62Encoder {

    /**
     * The Base62 alphabet: digits first, then lowercase, then uppercase.
     * This ordering is a convention — the specific order doesn't matter
     * as long as encode() and decode() use the same alphabet.
     */
    private static final String ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int BASE = ALPHABET.length(); // 62

    // Prevent instantiation — all methods are static
    private Base62Encoder() {
        throw new UnsupportedOperationException("Utility class — do not instantiate");
    }

    /**
     * Encodes a non-negative long ID into a Base62 string.
     *
     * <p>Examples:
     * <pre>
     *   encode(0)     → "0"
     *   encode(1)     → "1"
     *   encode(61)    → "Z"
     *   encode(62)    → "10"
     *   encode(12345) → "3d7"
     * </pre>
     *
     * @param id the numeric ID to encode (must be >= 0)
     * @return the Base62 encoded string
     * @throws IllegalArgumentException if id is negative
     */
    public static String encode(long id) {
        if (id < 0) {
            throw new IllegalArgumentException(
                    "ID must be non-negative for Base62 encoding, got: " + id);
        }

        // Special case: 0 encodes to "0"
        if (id == 0) {
            return String.valueOf(ALPHABET.charAt(0));
        }

        // Standard base conversion: repeatedly divide by 62, prepend remainder
        StringBuilder encoded = new StringBuilder();
        long current = id;
        while (current > 0) {
            int remainder = (int) (current % BASE);
            encoded.append(ALPHABET.charAt(remainder));
            current /= BASE;
        }

        // Digits were appended in reverse order (least significant first)
        return encoded.reverse().toString();
    }

    /**
     * Decodes a Base62 string back to the original numeric ID.
     *
     * <p>This is the inverse of {@link #encode(long)}:
     * <pre>
     *   decode(encode(x)) == x  // always true for valid x
     * </pre>
     *
     * @param shortUrl the Base62 encoded string
     * @return the original numeric ID
     * @throws IllegalArgumentException if shortUrl is null, empty, or contains invalid characters
     */
    public static long decode(String shortUrl) {
        if (shortUrl == null || shortUrl.isEmpty()) {
            throw new IllegalArgumentException(
                    "Short URL cannot be null or empty for Base62 decoding");
        }

        long id = 0;
        for (int i = 0; i < shortUrl.length(); i++) {
            char c = shortUrl.charAt(i);
            int charIndex = ALPHABET.indexOf(c);

            if (charIndex == -1) {
                throw new IllegalArgumentException(
                        "Invalid Base62 character: '" + c + "' in short URL: " + shortUrl);
            }

            // Check for overflow before multiplication
            // Long.MAX_VALUE / BASE gives the max safe value before multiply
            if (id > (Long.MAX_VALUE - charIndex) / BASE) {
                throw new ArithmeticException(
                        "Base62 decode overflow for input: " + shortUrl);
            }

            id = id * BASE + charIndex;
        }

        return id;
    }
}
