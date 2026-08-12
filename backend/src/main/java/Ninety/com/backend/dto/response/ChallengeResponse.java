package Ninety.com.backend.dto.response;

import lombok.Builder;

import java.time.LocalDate;
import java.util.List;

@Builder
public record ChallengeResponse(
        Long id,
        String title,
        boolean[][] dayGrid,
        int currentDay,
        int currentStreak,
        int longestStreak,
        int streakCount,
        int missedCount,
        int completedCount,
        LocalDate startedAt,
        boolean completed,
        LocalDate createdAt,
        LocalDate updatedAt,

        List<ActivityResponse> activities
) {
}
