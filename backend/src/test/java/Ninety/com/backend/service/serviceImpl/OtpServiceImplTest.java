package Ninety.com.backend.service.serviceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

@ExtendWith(MockitoExtension.class)
class OtpServiceImplTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @InjectMocks
    private OtpServiceImpl otpService;

    @BeforeEach
    void setup() {
        ReflectionTestUtils.setField(otpService, "expiryMinutes", 1L);

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    @DisplayName("Test OTP Generation")
    void testOtpGeneration() {

        String email = "test@gmail.com";

        String otp = otpService.generateAndStoreOtp(email);

        assertNotNull(otp);
        assertEquals(6, otp.length());

        verify(valueOperations).set(
                eq("otp" + email),
                eq(otp),
                eq(Duration.ofMinutes(1))
        );
    }

    @Test
    @DisplayName("Test Verify when OTP is correct")
    void testVerifyOtp_WhenOtpIsCorrect(){
        String email = "test@gmail.com";
        String otp = "123456";

        when(redisTemplate.opsForValue())
                .thenReturn(valueOperations);

        when(valueOperations.get("otp" + email))
                .thenReturn("123456");

        boolean result = otpService.verifyOtp(email, otp);

        assertTrue(result);

        verify(redisTemplate).delete("otp" + email);
    }

    @Test
    @DisplayName("Verify test with wrong OTP")
    void testVerifyOtp_WhenOtpIsWrong(){
        String email = "test@gmail.com";

        when(redisTemplate.opsForValue())
                .thenReturn(valueOperations);

        when(valueOperations.get("otp" + email))
                .thenReturn(654321);

        boolean result = otpService.verifyOtp(email, "123456");

        assertFalse(result);

        verify(redisTemplate, never())
                .delete(anyString());
    }

    @Test
    @DisplayName("Verify test when OTP doesn't exist")
    void testVerifyOtp_WhenOtpDoesNotExist(){
        String email = "test@gamil.com";

        when(redisTemplate.opsForValue())
                .thenReturn(valueOperations);

        when(valueOperations.get("otp" + email))
                .thenReturn(null);

        boolean result = otpService.verifyOtp(email, "123456");

        assertFalse(result);

        verify(redisTemplate, never())
                .delete(anyString());
    }
}