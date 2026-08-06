package Ninety.com.backend.controller;

import Ninety.com.backend.service.OtpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.models.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/mail")
@RequiredArgsConstructor
@Tag(name = "Mailing", description = "Handle Resend mailing operations for Send OTP")
public class MailController {

    private OtpService otpService;

    @Operation(summary = "Send an eamil with attached OTP to the respective user for verify email")
    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<void>> sendOtp(@PathVariable String email){
        otpService.generateAndStoreOtp(email);
    }

}
