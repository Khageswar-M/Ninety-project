package Ninety.com.backend.io.response;

import lombok.Builder;

import java.util.List;

@Builder
public record CoachResponse(
        String title,
        String summary,
        List<String> recommendation,
        List<String> weeklyPlan
) {
}
