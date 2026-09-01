package Ninety.com.backend.service;

import Ninety.com.backend.io.request.VerifyOtpRequest;

public interface OtpService {
    String generateAndStoreOtp(String toEmail);

    boolean verifyOtp(VerifyOtpRequest request);
}
