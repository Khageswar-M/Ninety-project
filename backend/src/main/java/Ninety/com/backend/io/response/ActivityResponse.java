package Ninety.com.backend.io.response;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ActivityResponse(
        Long id,
        int dayNumber,
        String title,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
