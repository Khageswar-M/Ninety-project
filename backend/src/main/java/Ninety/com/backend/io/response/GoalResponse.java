package Ninety.com.backend.io.response;

import lombok.Builder;

@Builder
public record GoalResponse(
        long id,
        String title,
        String status,
        String createdAt,
        String updatedAt
) {
}
