package Ninety.com.backend.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {
    private boolean success;
    private int status;
    private String error;
    private String message;
    private String path;
    private List<String> details;
    @Builder.Default
    private Instant timeStamp = Instant.now();
}
