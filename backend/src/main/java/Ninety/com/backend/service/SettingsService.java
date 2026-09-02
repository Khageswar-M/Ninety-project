package Ninety.com.backend.service;

import Ninety.com.backend.io.request.UpdateUserNameRequest;
import Ninety.com.backend.io.response.SettingsResponse;
import Ninety.com.backend.io.response.SettingsSingleResponse;
import Ninety.com.backend.entity.Theme;

public interface SettingsService {

    SettingsResponse getSettings();

    SettingsSingleResponse toggleDailyRemainder();

    SettingsSingleResponse updateReminderTime(String time);

    SettingsSingleResponse toggleAiCoachDigest();

    SettingsSingleResponse toggleMileStoneAlerts();

    SettingsSingleResponse updateTheme(Theme theme);

    SettingsSingleResponse updateUserName(UpdateUserNameRequest request);
}
