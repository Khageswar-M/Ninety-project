package Ninety.com.backend.service;

public interface OtpService {
    String generateAndStoreOtp(String email);

    boolean verifyOtp(String email, String otp);
}
