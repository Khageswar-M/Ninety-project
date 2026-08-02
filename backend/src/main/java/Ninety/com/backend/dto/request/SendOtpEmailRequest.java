package Ninety.com.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendOtpEmailRequest {

    @NotBlank(message = "Email is required")
    private String toEmail;

    private String fullName;
}
