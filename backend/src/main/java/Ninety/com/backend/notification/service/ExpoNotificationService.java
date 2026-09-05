package Ninety.com.backend.notification.service;

import Ninety.com.backend.notification.io.request.SendNotificationRequest;
import Ninety.com.backend.notification.io.response.ExpoPushResponse;
import Ninety.com.backend.notification.io.response.ExpoReceiptResponse;

import java.util.List;

public interface ExpoNotificationService {

    ExpoPushResponse sendNotification( SendNotificationRequest request );

    ExpoReceiptResponse getReceipts( List<String> receiptIds );

}
