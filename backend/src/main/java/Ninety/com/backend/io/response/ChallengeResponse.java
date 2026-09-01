package Ninety.com.backend.io.response;

import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
public record ChallengeResponse(
        Long id,
        String title,
        boolean[][] dayGrid,
        int currentDay,
        LocalDate createdAt,
        LocalDateTime updatedAt
) {
}
