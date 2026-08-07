package Ninety.com.backend.utils;

import Ninety.com.backend.exception.UserNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp(){
        jwtUtil = new JwtUtil();

        ReflectionTestUtils.setField(
                jwtUtil,
                "SECRET_KEY",
                "ThisIsMyVerySecureSecretKeyThatIsAtLeast32CharactersLong"
        );
    }

    @Test
    void shouldGenerateToken(){
        String token = jwtUtil.generateToken("test@gmail.com");
        System.out.println(token);

        assertNotNull(token);
        assertFalse(token.isBlank());
    }

    @Test
    void shouldExtractEmail(){
        String token = jwtUtil.generateToken("test@gmail.com");
        String email = jwtUtil.extractEmail(token);

        assertEquals("test@gmail.com", email);
    }

    @Test
    void shouldReturnFutureExpirationDate(){
        String token = jwtUtil.generateToken("test@gmail.com");
        Date expiration = jwtUtil.extractExpiration(token);
        System.out.println(expiration);
        assertTrue(expiration.after(new Date()));
    }

    @Test
    void shouldReturnFalseWhenTokenNotExpired(){
        String token = jwtUtil.generateToken("test@gmail.com");
        assertFalse(jwtUtil.isTokenExpired(token));
    }

    @Test
    void shouldReturnFalseWhenEmailDoesNotMatch() {

        String token = jwtUtil.generateToken("john@gmail.com");

        UserDetails user = mock(UserDetails.class);

        when(user.getUsername())
                .thenReturn("abc@gmail.com");

        assertFalse(jwtUtil.validateToken(token, user));
    }

    @Test
    void shouldThrowExceptionForInvalidToken() {

        assertThrows(
                UserNotFoundException.class,
                () -> jwtUtil.isTokenExpired("invalid_token")
        );
    }

}