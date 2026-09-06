package Ninety.com.backend.io.response;

import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
public record ChallengesResponse(
        Long id,
        String title,
        boolean[][] dayGrid,
        int currentDay,
        int longestStreak,
        int completedCount,
        int missedCount,
        LocalDate createdAt,
        LocalDateTime updatedAt,
        boolean completed
) {
}
