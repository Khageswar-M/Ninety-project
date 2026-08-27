package Ninety.com.backend.dto.response;

import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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
