package Ninety.com.backend.utils;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

//import static org.junit.jupiter.api.Assertions.*;

//@SpringBootTest
public class JwtUtilTest {

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    void shouldGenerateJwtToken() {

        String email = "test@gmail.com";
        String token = jwtUtil.generateToken(email);
//
//        assertNotNull(token);
//        assertFalse(token.isEmpty());

        System.out.println("Generated JWT token:");
        System.out.println(token);
    }
}