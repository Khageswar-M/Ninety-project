package Ninety.com.backend.io.request;

import java.time.Duration;

public record RateLimitOf(
        int capacity,
        Duration duration
) {
}
