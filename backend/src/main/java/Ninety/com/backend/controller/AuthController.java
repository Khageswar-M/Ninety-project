package Ninety.com.backend.controller;

import Ninety.com.backend.io.request.*;
import Ninety.com.backend.io.response.ApiResponse;
import Ninety.com.backend.io.response.LoginResponse;
import Ninety.com.backend.service.AuthService;
import Ninety.com.backend.service.EmailService;
import Ninety.com.backend.service.OtpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Control verify OTP , Register")
public class AuthController {

    private final OtpService otpService;
    private final EmailService emailService;
    private final AuthService authService;

    @Operation(summary = "Send an email with attached OTP to the respective user for verify email")
    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@Valid @RequestBody SendOtpRequest request){

        emailService.sendOtpEmail(request.toEmail(), request.fullName());


        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("OTP sent successfully. Please check you email for OTP.", null));
    }

    @Operation(summary = "Send an email with attached OTP to the respective user for forget password")
    @PostMapping("/send-forget-password-otp")
    public ResponseEntity<ApiResponse<Void>> sendPasswordResendOtp(
            @NotBlank(message = "Valid email required.")
            @Email
            @RequestParam
            String toEmail
    ){
        emailService.sendPasswordResetOtp(toEmail);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("OTP sent successfully.", null));
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


    @Operation(summary = "Register with full name , email & password")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(
            @Valid
            @RequestBody
            RegisterRequest request
    ){
        authService.register(request);

        return ResponseEntity.ok(ApiResponse.success("Registration successful", null));
    }

    @Operation(summary = "Login with email & password, return JWT token")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(
            @Valid
            @RequestBody
            LoginRequest request
    ){
        LoginResponse response = authService.login(request);

        ResponseCookie cookie = ResponseCookie.from("jwt", response.jwtToken())
                .httpOnly(true)
                .secure(false) // true in production
                .path("/")
                .maxAge(Duration.ofDays(1))
                .sameSite("None")
                .build();

        return ResponseEntity
                .ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        cookie.toString()
                )
                .body(
                        ApiResponse.success(
                                "Login successful",
                                response
                        )
                );
    }

    @Operation(summary = "Logout the currently authenticated user.")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(){
        authService.logout();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Logout successful",
                        null
                )
        );
    }

    @Operation(summary = "Update user with new password")
    @PostMapping("/update-password")
    public ResponseEntity<ApiResponse<Void>> updatedPassword(
            @Valid
            @RequestBody
            UpdatePasswordRequest request
    ){
        authService.updatePassword(request);

        return ResponseEntity.ok(ApiResponse.success("Password updated successfully.", null));
    }

    @PutMapping("/user-name")
    public ResponseEntity<ApiResponse> updateName(
            @Valid @RequestBody UpdateUserNameRequest request
    ){
        authService.updateFullName(request.newName());

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Name updated successfully.",
                        null
                )
        );
    }


}
