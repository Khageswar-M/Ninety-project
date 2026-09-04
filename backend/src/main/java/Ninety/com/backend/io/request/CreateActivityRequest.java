package Ninety.com.backend.io.request;

import jakarta.validation.constraints.NotNull;

public record CreateActivityRequest(

        @NotNull
        Long challengeId,

        @NotNull
        String title

) {
}
