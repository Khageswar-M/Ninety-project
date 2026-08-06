package Ninety.com.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SendOtpRequest(
        @Email
        @NotBlank
        String toEmail,
        @NotBlank
        String fullName
) {
}
