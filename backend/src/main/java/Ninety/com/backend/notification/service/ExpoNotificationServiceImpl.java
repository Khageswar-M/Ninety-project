package Ninety.com.backend.notification.service;

import Ninety.com.backend.entity.Settings;
import Ninety.com.backend.notification.io.request.ExpoPushRequest;
import Ninety.com.backend.notification.io.request.ExpoReceiptRequest;
import Ninety.com.backend.notification.io.request.SendNotificationRequest;
import Ninety.com.backend.notification.io.response.ExpoPushResponse;
import Ninety.com.backend.notification.io.response.ExpoReceiptResponse;
import Ninety.com.backend.repository.SettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExpoNotificationServiceImpl implements ExpoNotificationService{


    private final RestClient restClient;

    private final SettingsRepository settingsRepository;


    @Value("${expo.push.send-url}")
    private String sendUrl;

    @Value("${expo.push.receipt-url}")
    private String receiptUrl;


    public ExpoPushResponse sendNotification(
            SendNotificationRequest request
    ){
        ExpoPushRequest expoRequest = ExpoPushRequest.builder()
                .to(request.expoPushToken())
                .title(request.title())
                .body(request.body())
                .sound(request.sound())
                .data(request.data())
                .build();

        return restClient
                .post()
                .uri(sendUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .body(expoRequest)
                .retrieve()
                .body(ExpoPushResponse.class);
    }

    public ExpoReceiptResponse getReceipts(
            List<String> receiptIds
    ){

        ExpoReceiptRequest request =
                new ExpoReceiptRequest(receiptIds);

        return restClient
                .post()
                .uri(receiptUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(ExpoReceiptResponse.class);
    }


    @Scheduled(
            cron = "0 * * * * *"
    )
    public void sendDailyReminders(){

        List<Settings> settingsList =
                settingsRepository.findByDailyReminderTrueAndExpoPushTokenIsNotNull();

        for(Settings settings : settingsList){

            try{
                ZoneId zoneId =
                        ZoneId.of(settings.getTimezone());

                LocalTime currentTime =
                        LocalTime.now(zoneId);

                LocalTime reminderTime = Instant
                        .parse(settings.getReminderTime())
                        .atZone(zoneId)
                        .toLocalTime();

                if(currentTime.getHour() == reminderTime.getHour()
                    && currentTime.getMinute() == reminderTime.getMinute()
                ){
                    sendDailyReminder(settings);
                }
            }catch (Exception e){
                log.error(
                        "Failed to process daily reminder for user {}",
                        settings.getUser().getId(),
                        e
                );
            }
        }
    }

    private void sendDailyReminder(Settings settings){
        SendNotificationRequest request =
                new SendNotificationRequest(
                        settings.getExpoPushToken(),
                        "Daily Reminder",
                        "It's time to continue your challenge!",
                        "default",
                        Map.of("screen", "/(tabs)/ActionsScreen")
                );

        sendNotification(request);

        log.info(
                "Daily reminder send to user {}",
                settings.getUser().getId()
        );
    }
}
