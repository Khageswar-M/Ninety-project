package Ninety.com.backend.service.serviceImpl;

import Ninety.com.backend.dto.response.SettingsResponse;
import Ninety.com.backend.dto.response.SettingsSingleResponse;
import Ninety.com.backend.entity.Settings;
import Ninety.com.backend.entity.User;
import Ninety.com.backend.exception.UserNotFoundException;
import Ninety.com.backend.repository.SettingsRepository;
import Ninety.com.backend.repository.UserRepository;
import Ninety.com.backend.service.SettingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class SettingsServiceImpl implements SettingsService {

    private final SettingsRepository settingsRepository;
    private final UserRepository userRepository;

    @Override
    public SettingsResponse getSettings() {

        User loggedinUser = getLoggedInUser();

        Settings settings = loggedinUser.getSettings();

        return mapToSettingsResponse(settings);
    }

    @Override
    public SettingsSingleResponse toggleDailyRemainder() {
        User loggedinUser = getLoggedInUser();

        Settings settings = loggedinUser.getSettings();
        boolean isDailyReminder = settings.getDailyReminder();
        settings.setDailyReminder(!isDailyReminder);
        settingsRepository.save(settings);

        Settings updatedSettings = settingsRepository.save(settings);

        return SettingsSingleResponse.builder()
                .settingsId(updatedSettings.getId())
                .settingName("isDailReminder")
                .value(updatedSettings.getDailyReminder())
                .build();
    }

    @Override
    public SettingsSingleResponse updateReminderTime(String time) {
        if(time == null) return null;

        LocalTime localTime = LocalTime.parse(time);

        User loggedinUser = getLoggedInUser();

        Settings settings = loggedinUser.getSettings();

        settings.setReminderTime(localTime);

        Settings updatedSetting = settingsRepository.save(settings);

        return SettingsSingleResponse.builder()
                .settingsId(updatedSetting.getId())
                .settingName("Reminder Time")
                .value(updatedSetting.getReminderTime())
                .build();
    }

    @Override
    public SettingsSingleResponse toggleAiCoachDigest() {
        return null;
    }

    @Override
    public SettingsSingleResponse toggleMileStoneAlerts() {
        return null;
    }

    @Override
    public SettingsSingleResponse updateTheme() {
        return null;
    }

    private User getLoggedInUser(){
        Authentication authentication =
                SecurityContextHolder.
                        getContext().
                            getAuthentication();

        String email = authentication.getName();

        if(email == null) return null;

        User loggedinUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        return loggedinUser;
    }

    private SettingsResponse mapToSettingsResponse(Settings settings){
        if(settings == null) return null;

        return SettingsResponse.builder()
                .id(settings.getId())
                .dailyRemainder(settings.getDailyReminder())
                .reminderTime(settings.getReminderTime().toString())
                .aiCoachDigest(settings.getAiCoach())
                .mileStoneAlert(settings.getMilestoneAlert())
                .theme(settings.getTheme().toString())
                .createdAt(settings.getCreatedAt().toString())
                .updated(settings.getUpdatedAt().toString())
                .build();
    }
}
