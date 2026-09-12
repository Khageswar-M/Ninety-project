package Ninety.com.backend.security;

import Ninety.com.backend.io.request.RateLimitOf;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final Map<String, RateLimitOf> RATE_LIMITS = Map.ofEntries(

            // =========================
            // AUTH APIs
            // =========================

            Map.entry(
                    "/api/v1/auth/send-otp",
                    new RateLimitOf(5, Duration.ofHours(1))
            ),

            Map.entry(
                    "/api/v1/auth/send-forget-password-otp",
                    new RateLimitOf(5, Duration.ofHours(1))
            ),

            Map.entry(
                    "/api/v1/auth/login",
                    new RateLimitOf(5, Duration.ofHours(1))
            ),

            Map.entry(
                    "/api/v1/auth/register",
                    new RateLimitOf(5, Duration.ofHours(1))
            ),


            // =========================
            // ACTIVITY APIs
            // =========================

            Map.entry(
                    "/api/v1/activity/create",
                    new RateLimitOf(1, Duration.ofSeconds(1))
            ),

            Map.entry(
                    "/api/v1/activity/update",
                    new RateLimitOf(1, Duration.ofSeconds(1))
            ),

            Map.entry(
                    "/api/v1/activity/activities",
                    new RateLimitOf(1, Duration.ofSeconds(1))
            ),


            // =========================
            // AI COACH
            // =========================

            Map.entry(
                    "/api/v1/ai-coach",
                    new RateLimitOf(2, Duration.ofMinutes(1))
            ),


            // =========================
            // CHALLENGE APIs
            // =========================

            Map.entry(
                    "/api/v1/challenge/create-challenge",
                    new RateLimitOf(1, Duration.ofSeconds(1))
            ),

            Map.entry(
                    "/api/v1/challenge/challenges-by-userId",
                    new RateLimitOf(1, Duration.ofSeconds(1))
            ),


            // =========================
            // GOAL APIs
            // =========================

            Map.entry(
                    "/api/v1/goal/create",
                    new RateLimitOf(1, Duration.ofSeconds(1))
            ),

            Map.entry(
                    "/api/v1/goal/update",
                    new RateLimitOf(1, Duration.ofSeconds(1))
            ),

            Map.entry(
                    "/api/v1/goal/update/status",
                    new RateLimitOf(1, Duration.ofSeconds(1))
            ),

            Map.entry(
                    "/api/v1/goal/delete",
                    new RateLimitOf(1, Duration.ofSeconds(1))
            ),


            // =========================
            // SETTINGS APIs
            // =========================

            Map.entry(
                    "/api/v1/settings",
                    new RateLimitOf(1, Duration.ofSeconds(1))
            ),

            Map.entry(
                    "/api/v1/settings/toggle-daily-reminder",
                    new RateLimitOf(1, Duration.ofSeconds(1))
            ),

            Map.entry(
                    "/api/v1/settings/daily-reminder",
                    new RateLimitOf(1, Duration.ofSeconds(1))
            ),

            Map.entry(
                    "/api/v1/settings/toggle-ai-coach",
                    new RateLimitOf(1, Duration.ofSeconds(1))
            ),

            Map.entry(
                    "/api/v1/settings/toggle-mile-stone",
                    new RateLimitOf(1, Duration.ofSeconds(1))
            ),

            Map.entry(
                    "/api/v1/settings/theme",
                    new RateLimitOf(1, Duration.ofSeconds(1))
            ),

            Map.entry(
                    "/api/v1/settings/user-name",
                    new RateLimitOf(1, Duration.ofSeconds(1))
            ),

            Map.entry(
                    "/api/v1/settings/expo-notification-token",
                    new RateLimitOf(1, Duration.ofSeconds(1))
            )
    );

    private final Map<String, Bucket> buckets =
            new ConcurrentHashMap<>();


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        /*
         * CORS preflight requests should not consume
         * rate-limit tokens.
         */
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getServletPath();

        String endpointKey = resolveEndpoint(path);

        /*
         * Endpoint doesn't have a rate limit.
         */
        if (endpointKey == null) {
            filterChain.doFilter(request, response);
            return;
        }

        RateLimitOf rateLimit = RATE_LIMITS.get(endpointKey);

        String clientIp = getClientIp(request);

        String bucketKey =
                clientIp
                        + ":"
                        + request.getMethod()
                        + ":"
                        + endpointKey;

        Bucket bucket = buckets.computeIfAbsent(
                bucketKey,
                key -> createBucket(rateLimit)
        );

        if (bucket.tryConsume(1)) {

            filterChain.doFilter(request, response);

        } else {

            sendTooManyRequestsResponse(
                    response,
                    bucket
            );
        }
    }


    /**
     * Converts the actual request path into the
     * configured endpoint key.
     */
    private String resolveEndpoint(String path) {

        // Exact endpoints
        if (RATE_LIMITS.containsKey(path)) {
            return path;
        }


        // =========================
        // CHALLENGE
        // =========================

        if (path.matches(
                "/api/v1/challenge/delete-challenge/\\d+"
        )) {
            return "/api/v1/challenge/delete-challenge";
        }


        if (path.matches(
                "/api/v1/challenge/challenges-by-userId/\\d+"
        )) {
            return "/api/v1/challenge/challenges-by-userId";
        }


        // =========================
        // GOAL
        // =========================

        if (path.matches(
                "/api/v1/goal/create/.+"
        )) {
            return "/api/v1/goal/create";
        }


        /*
         * IMPORTANT:
         * Check status before generic update.
         */
        if (path.matches(
                "/api/v1/goal/update/status/\\d+/[^/]+"
        )) {
            return "/api/v1/goal/update/status";
        }


        if (path.matches(
                "/api/v1/goal/update/\\d+/.+"
        )) {
            return "/api/v1/goal/update";
        }


        if (path.matches(
                "/api/v1/goal/delete/\\d+"
        )) {
            return "/api/v1/goal/delete";
        }


        // =========================
        // SETTINGS
        // =========================

        if (path.matches(
                "/api/v1/settings/daily-reminder/.+"
        )) {
            return "/api/v1/settings/daily-reminder";
        }


        if (path.matches(
                "/api/v1/settings/theme/[^/]+"
        )) {
            return "/api/v1/settings/theme";
        }


        return null;
    }


    private Bucket createBucket(RateLimitOf limit) {

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


    private String getClientIp(HttpServletRequest request) {

        /*
         * If the application is directly exposed to the internet,
         * use getRemoteAddr().
         *
         * If you're behind a trusted reverse proxy, configure the
         * proxy properly and then use X-Forwarded-For.
         */

        String forwardedFor =
                request.getHeader("X-Forwarded-For");

        if (forwardedFor != null && !forwardedFor.isBlank()) {

            /*
             * First address is normally the original client.
             */
            return forwardedFor
                    .split(",")[0]
                    .trim();
        }

        return request.getRemoteAddr();
    }


    private void sendTooManyRequestsResponse(
            HttpServletResponse response,
            Bucket bucket
    ) throws IOException {

        response.setStatus(
                429
        );

        response.setContentType("application/json");

        /*
         * Tell the client approximately how long
         * it should wait.
         */
        long nanos =
                bucket.estimateAbilityToConsume(
                        1
                ).getNanosToWaitForRefill();

        long retryAfterSeconds =
                Math.max(
                        1,
                        (long) Math.ceil(
                                nanos / 1_000_000_000.0
                        )
                );

        response.setHeader(
                "Retry-After",
                String.valueOf(retryAfterSeconds)
        );

        response.getWriter().write("""
                {
                    "success": false,
                    "status": 429,
                    "error": "Too Many Requests",
                    "message": "Too many requests. Please try again later."
                }
                """);
    }
}