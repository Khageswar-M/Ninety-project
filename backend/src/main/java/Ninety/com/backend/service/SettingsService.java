package Ninety.com.backend.service;

import Ninety.com.backend.dto.response.SettingsResponse;
import Ninety.com.backend.dto.response.SettingsSingleResponse;

public interface SettingsService {

    SettingsResponse getSettings();

    SettingsSingleResponse toggleDailyRemainder();

    SettingsSingleResponse updateReminderTime(String time);

    SettingsSingleResponse toggleAiCoachDigest();

    SettingsSingleResponse toggleMileStoneAlerts();

    SettingsSingleResponse updateTheme();
}
