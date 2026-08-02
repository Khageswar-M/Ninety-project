package Ninety.com.backend.service.serviceImpl;

import Ninety.com.backend.dto.request.VerifyOtpRequest;
import Ninety.com.backend.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String KEY_PREFIX = "otp";

    @Value("${app.otp.expiry-minutes}")
    private long expiryMinutes;

    @Value("${app.otp.length}")
    private int otpLength;

    @Override
    public String generateAndStoreOtp(String email) {
        String otp = generateNumericOtp(otpLength);
        redisTemplate.opsForValue().set(KEY_PREFIX + email, otp, Duration.ofMinutes(expiryMinutes));
        log.debug("Generated OTP for {} (expires in {} min)", email, expiryMinutes);
        return otp;
    }

    @Override
    public boolean verifyOtp(VerifyOtpRequest request) {
        String key = KEY_PREFIX + request.getEmail();
        Object stored = redisTemplate.opsForValue().get(key);
        boolean valid = stored != null && stored.toString().equals(request.getOtp());

        if(valid){
            redisTemplate.delete(key);
        }

        return valid;
    }

    private String generateNumericOtp(int length){
        StringBuilder sb = new StringBuilder(length);
        for(int i = 0; i < length; i++){
            sb.append(RANDOM.nextInt(10));
        }

        return sb.toString();
    }
}
