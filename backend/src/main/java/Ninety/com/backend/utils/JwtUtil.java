package Ninety.com.backend.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private final SecretKey secretKey;

    // 24 hour
    @Value("${app.jwt.access-token-expiration-ms}")
    private long JWT_EXPIRATION;

    public JwtUtil(@Value("${app.jwt.secret}") String secret) {

        if (secret == null || secret.isBlank()) {
            throw new IllegalArgumentException(
                    "JWT secret must not be null or empty."
            );
        }

        /*
         * HS256 requires a sufficiently long secret.
         * Keep the secret at least 32 bytes long.
         */
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalArgumentException(
                    "JWT secret must be at least 32 bytes long."
            );
        }

        this.secretKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }


    /**
     * Generate JWT for a user.
     */
    public String generateToken(String email) {

        Map<String, Object> claims = new HashMap<>();

        return createToken(claims, email);
    }


    /**
     * Create JWT with claims, subject, issued time and expiration.
     */
    public String createToken(
            Map<String, Object> claims,
            String email
    ) {

        Date issuedAt = new Date();

        Date expiration = new Date(
                issuedAt.getTime() + JWT_EXPIRATION
        );

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(issuedAt)
                .expiration(expiration)
                .signWith(secretKey)
                .compact();
    }


    /**
     * Extract all claims from a valid JWT.
     *
     * Signature is verified before claims are trusted.
     */
    private Claims extractAllClaims(String token) {

        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException(
                    "JWT token must not be null or empty."
            );
        }

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    /**
     * Extract a specific claim from the JWT.
     */
    public <T> T extractClaims(
            String token,
            Function<Claims, T> claimsResolver
    ) {

        Claims claims = extractAllClaims(token);

        return claimsResolver.apply(claims);
    }


    /**
     * Extract email from JWT subject.
     */
    public String extractEmail(String token) {

        return extractClaims(
                token,
                Claims::getSubject
        );
    }


    /**
     * Extract expiration date from JWT.
     */
    public Date extractExpiration(String token) {

        return extractClaims(
                token,
                Claims::getExpiration
        );
    }


    /**
     * Check whether JWT is expired.
     *
     * Returns:
     * true  -> token is expired
     * false -> token is still valid
     *
     * Invalid JWTs throw JwtException instead of
     * being incorrectly converted to UserNotFoundException.
     */
    public boolean isTokenExpired(String token) {

        Date expiration = extractExpiration(token);

        return expiration.before(new Date());
    }


    /**
     * Validate JWT against UserDetails.
     */
    public boolean validateToken(
            String token,
            UserDetails userDetails
    ) {

        try {

            String email = extractEmail(token);

            return email.equals(userDetails.getUsername())
                    && !isTokenExpired(token);

        } catch (JwtException | IllegalArgumentException ex) {

            return false;
        }
    }
}