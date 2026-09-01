package Ninety.com.backend.io.response;

import lombok.Builder;

@Builder
public record SettingsSingleResponse(
        long settingsId,
        String settingName,
        Object value

) {
}
