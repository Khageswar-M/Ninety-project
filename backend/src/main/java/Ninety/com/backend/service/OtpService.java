package Ninety.com.backend.service;

import Ninety.com.backend.dto.request.VerifyOtpRequest;

public interface OtpService{
    /*Generate an OTP, stores it in Redis with a TTL, and return it.*/
    String generateAndStoreOtp(String email);

    /*Validate the OTP against Redis, consumes it (deletes) on success*/
    boolean verifyOtp(VerifyOtpRequest request);
}
