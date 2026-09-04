package Ninety.com.backend.io.request;

import jakarta.validation.constraints.NotBlank;

public record ExpoNotificationTokenRequest(
        @NotBlank(message = "Push notification token must required.")
        String pushNotificationToken,

        @NotBlank(message = "Device platform must required")
        String devicePlatform
) {
}
