package Ninety.com.backend.io.response;

import Ninety.com.backend.dto.ChallengeAiPayload;
import lombok.Builder;

@Builder
public record AiInsightResponse(
        ChallengeAiPayload data,
        String aiMessage
) {
}
