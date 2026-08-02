package Ninety.com.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateChallengeRequest {

    @NotBlank(message = "Title is required")
    private String title;

}
