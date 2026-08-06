package Ninety.com.backend.controller;

import Ninety.com.backend.dto.request.SendOtpRequest;
import Ninety.com.backend.dto.request.VerifyOtpRequest;
import Ninety.com.backend.dto.response.ApiResponse;
import Ninety.com.backend.service.EmailService;
import Ninety.com.backend.service.OtpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Control verify OTP , Register")
public class AuthController {

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


    @Operation(summary = "Verify the OTP sent to the user's email")
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(
            @Valid
            @RequestBody
            VerifyOtpRequest request
    ){
        boolean verified = otpService.verifyOtp(request);

        if(verified){
            return ResponseEntity.ok(ApiResponse.success("Email verified successfully.", null));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.failure(
                        "Invalid OTP.", null));
    }

}
