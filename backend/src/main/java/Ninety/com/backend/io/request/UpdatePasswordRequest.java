package Ninety.com.backend.io.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record UpdatePasswordRequest(
        @Email
        @NotNull
        String email,

        @NotNull
        String password
) {
}
