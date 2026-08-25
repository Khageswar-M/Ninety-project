package Ninety.com.backend.dto.request;

import jakarta.validation.constraints.NotNull;

public record ActivityUpdateRequest(
        @NotNull
        Long activityId,

        @NotNull
        String newTitle
) {
}
