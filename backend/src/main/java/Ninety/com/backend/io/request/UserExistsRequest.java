package Ninety.com.backend.io.request;

import jakarta.validation.constraints.Email;

public record UserExistsRequest(
        @Email
        String email
) {
}
