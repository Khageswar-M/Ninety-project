package Ninety.com.backend.controller;

import Ninety.com.backend.dto.request.SendOtpRequest;
import Ninety.com.backend.dto.response.ApiResponse;
import Ninety.com.backend.service.EmailService;
import Ninety.com.backend.service.OtpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/mail")
@RequiredArgsConstructor
@Tag(name = "Mailing", description = "Handle Resend mailing operations for Send OTP")
public class MailController {

    private final OtpService otpService;
    private final EmailService emailService;

    @Operation(summary = "Send an email with attached OTP to the respective user for verify email")
    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@Valid @RequestBody SendOtpRequest request){

        String otp = otpService.generateAndStoreOtp(request.toEmail());
        emailService.sendOtpEmail(request.toEmail(), request.fullName());


        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("OTP sent successfully. Please check you email for OTP.", null));
    }

}
