package Ninety.com.backend.security;

import Ninety.com.backend.io.request.RateLimitOf;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final Map<String, RateLimitOf> RATE_LIMITS = Map.of(
            "/api/v1/auth/send-otp",
            new RateLimitOf(5, Duration.ofHours(1)),

            "/api/v1/auth/send-forget-password-otp",
            new RateLimitOf(5, Duration.ofHours(1)),

            "/api/v1/auth/login",
            new RateLimitOf(5, Duration.ofHours(1)),

            "/api/v1/auth/register",
            new RateLimitOf(5, Duration.ofHours(1))
    );

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getServletPath();

        // check whether the end point has rate limit or not
        RateLimitOf rateLimitOf = RATE_LIMITS.get(path);

        if(rateLimitOf == null){
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIp(request);

        /*
        * Each IP + endpoint gets its own bucket.
        * */
        String bucketKey = clientIp + ":" + path;

        Bucket bucket = buckets.computeIfAbsent(
                bucketKey,
                key -> createBucket(rateLimitOf)
        );

        if(bucket.tryConsume(1)){
            filterChain.doFilter(request, response);
        }else{
            sendTooManyRequestsResponse(response);
        }
    }

    private Bucket createBucket(RateLimitOf limit){

        Bandwidth bandwidth = Bandwidth.builder()
                .capacity(limit.capacity())
                .refillIntervally(
                        limit.capacity(),
                        limit.duration()
                )
                .build();

        return Bucket.builder()
                .addLimit(bandwidth)
                .build();
    }

    private String getClientIp(HttpServletRequest request){
        String forwardedFor = request.getHeader("X-Forwarded-For");

        if(forwardedFor != null && !forwardedFor.isBlank()){
            return forwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }

    private void sendTooManyRequestsResponse(
            HttpServletResponse response
    ) throws IOException{
        response.setStatus(429);

        response.setContentType("application/json");

        response.getWriter().write("""
                {
                    "success": false,
                    "status": 429,
                    "error": "Limit exceeded",
                    "message": "You have reached your limit. Please try again after an hour."
                }
                """);
    }
}
