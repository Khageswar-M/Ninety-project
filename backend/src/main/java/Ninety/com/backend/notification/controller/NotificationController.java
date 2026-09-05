package Ninety.com.backend.notification.controller;

import Ninety.com.backend.io.response.ApiResponse;
import Ninety.com.backend.notification.io.request.SendNotificationRequest;
import Ninety.com.backend.notification.io.response.ExpoPushResponse;
import Ninety.com.backend.notification.io.response.ExpoReceiptResponse;
import Ninety.com.backend.notification.service.ExpoNotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final ExpoNotificationService expoNotificationService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse> sendNotification(
            @Valid @RequestBody SendNotificationRequest request
            ){
        ExpoPushResponse response =
                expoNotificationService.sendNotification(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Notification sent",
                        response
                )
        );
    }

    @PostMapping("/receipts")
    public ResponseEntity<ApiResponse> getReceipt(
            @RequestBody List<String> receiptIds
            ){
        ExpoReceiptResponse response =
                expoNotificationService.getReceipts(receiptIds);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Receipts",
                        response
                )
        );
    }

}
