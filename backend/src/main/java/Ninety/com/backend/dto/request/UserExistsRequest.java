package Ninety.com.backend.dto.request;

import jakarta.validation.constraints.Email;

public record UserExistsRequest(
        @Email
        String email
) {
}
