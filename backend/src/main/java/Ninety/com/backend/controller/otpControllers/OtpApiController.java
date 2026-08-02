package Ninety.com.backend.controller.otpControllers;

import Ninety.com.backend.dto.request.SendOtpEmailRequest;
import Ninety.com.backend.dto.request.VerifyOtpRequest;
import Ninety.com.backend.dto.response.ApiResponse;
import Ninety.com.backend.service.EmailService;
import Ninety.com.backend.service.OtpService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/otp")
@RequiredArgsConstructor
@Tag(name = "OTP", description = "Store, Update and Delete OTP credentials in the Redis cache")
public class OtpApiController{

    private final EmailService emailService;
    private final OtpService otpService;

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<String>> sendOtpToUser(@Valid @RequestBody SendOtpEmailRequest request){
        emailService.sendOtpEmail(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Otp send successfully to the email ", request.getToEmail()));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<String>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request){
        boolean valid = otpService.verifyOtp(request);

        if(valid){
            return ResponseEntity.status(HttpStatus.OK)
                    .body(ApiResponse.success("Otp Verifies Successfully of email", request.getEmail()));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.success("Invalid or expired OTP"));
    }

}
