package Ninety.com.backend.service.serviceImpl;

import Ninety.com.backend.io.request.ExpoNotificationTokenRequest;
import Ninety.com.backend.io.request.UpdateUserNameRequest;
import Ninety.com.backend.io.response.SettingsResponse;
import Ninety.com.backend.io.response.SettingsSingleResponse;
import Ninety.com.backend.entity.Settings;
import Ninety.com.backend.entity.Theme;
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

import java.util.function.BiConsumer;
import java.util.function.Function;

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
        return toggleBooleanSetting(
                Settings::getDailyReminder,
                Settings::setDailyReminder,
                "Daily Reminder"
        );
    }

    @Override
    public SettingsSingleResponse toggleAiCoachDigest() {

        return toggleBooleanSetting(
                Settings::getAiCoach,
                Settings::setAiCoach,
                "Ai Coach Digest"
        );

    }

    @Override
    public SettingsSingleResponse toggleMileStoneAlerts() {

        return toggleBooleanSetting(
                Settings::getMilestoneAlert,
                Settings::setMilestoneAlert,
                "Mile Stone Alert"
        );
    }

    @Override
    public SettingsSingleResponse updateTheme(Theme theme) {

        if(theme == null) throw new IllegalArgumentException("Theme must not be null");

        return updateSetting(theme, Settings::setTheme, Settings::getTheme, "Theme");
    }

    @Override
    public SettingsSingleResponse updateUserName(UpdateUserNameRequest request) {

        User loggedinUser = getLoggedInUser();

        String userOldName = loggedinUser.getFullName();

        if(userOldName.equals(request.newName())) return null;

        loggedinUser.setFullName(request.newName());

        User updatedUser = userRepository.save(loggedinUser);

        return SettingsSingleResponse.builder()
                .settingsId(updatedUser.getId())
                .settingName("User full name")
                .value(updatedUser.getFullName())
                .build();
    }

    @Override
    public void addExpoPushNotificationToken(ExpoNotificationTokenRequest request) {
        User loggedUser = getLoggedInUser();

        Settings settings = loggedUser.getSettings();

        settings.setExpoPushToken(request.pushNotificationToken());
        settings.setPlatform(request.devicePlatform());

        settingsRepository.save(settings);
    }

    @Override
    public SettingsSingleResponse updateReminderTime(String time) {
        if(time == null) return null;


        return updateSetting(time, Settings::setReminderTime, Settings::getReminderTime, "Reminder Time");
    }

    private SettingsSingleResponse toggleBooleanSetting(
            Function<Settings, Boolean> getter,
            BiConsumer<Settings, Boolean> setter,
            String settingName
    ){
        User loggedInUser = getLoggedInUser();
        Settings settings = loggedInUser.getSettings();

        boolean current = getter.apply(settings);
        setter.accept(settings, !current);

        Settings updated = settingsRepository.save(settings);

        return SettingsSingleResponse.builder()
                .settingsId(updated.getId())
                .settingName(settingName)
                .value(getter.apply(updated))
                .build();
    }

    private <T> SettingsSingleResponse updateSetting(
            T newValue,
            BiConsumer<Settings, T> setter,
            Function<Settings, Object> valueGetter,
            String settingName
    ){
        User loggedInUser = getLoggedInUser();
        Settings settings = loggedInUser.getSettings();

        setter.accept(settings, newValue);
        Settings updated = settingsRepository.save(settings);

        return SettingsSingleResponse.builder()
                .settingsId(updated.getId())
                .settingName(settingName)
                .value(valueGetter.apply(updated))
                .build();
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
                .reminderTime(settings.getReminderTime())
                .aiCoachDigest(settings.getAiCoach())
                .mileStoneAlert(settings.getMilestoneAlert())
                .theme(settings.getTheme().toString())
                .build();
    }
}
