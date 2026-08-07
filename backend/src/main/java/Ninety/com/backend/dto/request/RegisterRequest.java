package Ninety.com.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record RegisterRequest(

        @Email
        @NotNull
        String email,

        @NotNull
        String fullName,

        @NotNull
        String password
) {
}
