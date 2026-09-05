package Ninety.com.backend.notification.io.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

import java.util.Map;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ExpoPushRequest(

        String to,

        String title,

        String body,

        String sound,

        Map<String, Object> data
) {
}
