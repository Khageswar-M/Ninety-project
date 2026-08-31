package Ninety.com.backend.dto.response;

import lombok.Builder;

@Builder
public record SettingsResponse(
        long id,
        boolean dailyRemainder,
        String reminderTime,
        boolean aiCoachDigest,
        boolean mileStoneAlert,
        String theme
) {
}
