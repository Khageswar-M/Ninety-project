package Ninety.com.backend.service;

import Ninety.com.backend.dto.request.VerifyOtpRequest;

public interface OtpService {
    String generateAndStoreOtp(String email);

    boolean verifyOtp(VerifyOtpRequest request);
}
