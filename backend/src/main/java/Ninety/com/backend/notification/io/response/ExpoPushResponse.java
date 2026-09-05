package Ninety.com.backend.notification.io.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ExpoPushResponse(
        Ticket data
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Ticket(
            String status,
            String id,
            String message,
            Map<String, Object> details
    ) {
    }
}