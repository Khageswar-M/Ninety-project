package Ninety.com.backend.controller;

import Ninety.com.backend.io.request.ExpoNotificationTokenRequest;
import Ninety.com.backend.io.request.UpdateUserNameRequest;
import Ninety.com.backend.io.response.ApiResponse;
import Ninety.com.backend.io.response.SettingsResponse;
import Ninety.com.backend.io.response.SettingsSingleResponse;
import Ninety.com.backend.entity.Theme;
import Ninety.com.backend.service.SettingsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/settings")
@RequiredArgsConstructor
@Tag(name = "Settings controller", description = "Use to control user settings data.")
public class SettingsController {


    private final SettingsService settingsService;

    @GetMapping()
    public ResponseEntity<ApiResponse> getSettings(){
        SettingsResponse response = settingsService.getSettings();

        return ResponseEntity.ok()
                .body(
                        ApiResponse.success(
                                "User settings.",
                                response
                        )
                );
    }

    @PutMapping("/toggle-daily-reminder")
    public ResponseEntity<ApiResponse> toggleDailyRemainder(){
        SettingsSingleResponse response = settingsService.toggleDailyRemainder();

        return ResponseEntity.ok()
                .body(
                        ApiResponse.success(
                                "Daily Reminder toggled successfully.",
                                response
                        )
                );
    }

    @PutMapping("/daily-reminder/{newTime}")
    public ResponseEntity<ApiResponse> updateReminderTime(
            @PathVariable String newTime
    ){
        SettingsSingleResponse response =
                settingsService.updateReminderTime(newTime);

        return ResponseEntity.ok()
                .body(
                        ApiResponse.success(
                                "Updated reminder time.",
                                response
                        )
                );
    }

    @PutMapping("/toggle-ai-coach")
    public ResponseEntity<ApiResponse> toggleAiCoach(){
        SettingsSingleResponse response =
                settingsService.toggleAiCoachDigest();

        return ResponseEntity.ok()
                .body(
                        ApiResponse.success(
                                "Ai digest toggled successfully.",
                                response
                        )
                );
    }

    @PutMapping("/toggle-mile-stone")
    public ResponseEntity<ApiResponse> toggleMileStone(){
        SettingsSingleResponse response =
                settingsService.toggleMileStoneAlerts();

        return ResponseEntity.ok()
                .body(
                        ApiResponse.success(
                                "Mile stone alert toggled",
                                        response
                        )
                );
    }

    @PutMapping("/theme/{themeName}")
    public ResponseEntity<ApiResponse> updateTheme(
             @PathVariable Theme themeName
            ){

        SettingsSingleResponse response = settingsService.updateTheme(themeName);

        return ResponseEntity.ok()
                .body(
                        ApiResponse.success(
                                "Theme updated",
                                response
                        )
                );
    }

    @PutMapping("/user-name")
    public ResponseEntity<ApiResponse> updateUserName(
            @Valid @RequestBody UpdateUserNameRequest request
            ){
        SettingsSingleResponse response = settingsService.updateUserName(request);

        if(response == null){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(
                            ApiResponse.failure(
                                    "Trying to update same name",
                                    null
                            )
                    );
        }

        return ResponseEntity.ok(
                ApiResponse.success(
                        "User name updated successfully",
                        response
                )
        );
    }

    @PutMapping("/expo-notification-token")
    public ResponseEntity<ApiResponse> addExpoPushNotificationToken(
            @Valid @RequestBody ExpoNotificationTokenRequest request
            ){

        settingsService.addExpoPushNotificationToken(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Token added successfully.",
                        null
                )
        );
    }

}
