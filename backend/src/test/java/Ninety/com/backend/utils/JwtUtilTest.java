package Ninety.com.backend.utils;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtUtilTest {

    private JwtUtil jwtUtil;

    private static final String SECRET =
            "ThisIsMyVerySecureSecretKeyThatIsAtLeast32CharactersLong";

    @BeforeEach
    void setUp() {

        jwtUtil = new JwtUtil(SECRET);
    }

    @Test
    void shouldExtractEmailFromValidToken() {

        String email = "khageswarmaharana462@gmail.com";

        // Generate token using the same JwtUtil
//        String token = jwtUtil.generateToken(email);
        String token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraGFnZXN3YXJtYWhhcmFuYTQ2MkBnbWFpbC5jb20iLCJpYXQiOjE3ODY0NjIxNTAsImV4cCI6MTc4NjQ2NTc1MH0.k3LVY9qsw9ycrjjHHN5pIfkVf3KP9AtBCSdcVwB_ng0";

        // Extract email
        String extractedEmail = jwtUtil.extractEmail(token);

        System.out.println("Extracted email: " + extractedEmail);

        assertEquals(email, extractedEmail);
    }
}