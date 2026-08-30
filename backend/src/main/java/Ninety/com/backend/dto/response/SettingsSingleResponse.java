package Ninety.com.backend.dto.response;

import lombok.Builder;

@Builder
public record SettingsSingleResponse(
        long settingsId,
        String settingName,
        Object value

) {
}
