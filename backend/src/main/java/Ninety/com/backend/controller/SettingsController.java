package Ninety.com.backend.controller;

import Ninety.com.backend.dto.response.ApiResponse;
import Ninety.com.backend.dto.response.SettingsResponse;
import Ninety.com.backend.dto.response.SettingsSingleResponse;
import Ninety.com.backend.entity.Theme;
import Ninety.com.backend.service.SettingsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotNull;
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

}
