package Ninety.com.backend.notification.io.request;

import jakarta.validation.constraints.NotBlank;

import java.util.Map;

public record SendNotificationRequest(

        @NotBlank
        String expoPushToken,

        @NotBlank
        String title,

        @NotBlank
        String body,

        String sound,

        Map<String, Object> data
) {

}
