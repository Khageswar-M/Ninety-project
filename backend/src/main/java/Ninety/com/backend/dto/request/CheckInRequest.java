package Ninety.com.backend.dto.request;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class CheckInRequest {

    @Min(1)
    private int dayNumber;

    private boolean completed;
}
