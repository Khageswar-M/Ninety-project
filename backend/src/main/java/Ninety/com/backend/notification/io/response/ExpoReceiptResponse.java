package Ninety.com.backend.notification.io.response;

import lombok.Data;

import java.util.List;
import java.util.Map;

public record ExpoReceiptResponse(
    Map<String, Receipt> data,
    List<ExpoError> errors
) {

    public record Receipt(
            String status,
            String message,
            Map<String, Object> details
    ){}

    public record ExpoError(
            String code,
            String message
    ){}

}
