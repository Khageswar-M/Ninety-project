package Ninety.com.backend.service.serviceImpl;

import Ninety.com.backend.exception.EmailDeliveryException;
import Ninety.com.backend.service.EmailService;
import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService{

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from-email}")
    private String fromEmail;

    private Resend client(){
        return new Resend(apiKey);
    }


    @Override
    @Async
    public CompletableFuture<Void> sendOtpEmail(String toEmail, String fullName, String otp) {
        String html = """
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
                    <h2>Verify your Ninety account</h2>
                    <p>Hi %s,</p>
                    <p>Your verification code is:</p>
                    <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px;">%s</p>
                    <p>This code expires shortly. If you didn't request this, you can ignore this email.</p>
                </div>
                """.formatted(fullName, otp);

        return send(toEmail, "Your Ninety verification code", html);

    }

    @Override
    @Async
    public CompletableFuture<Void> sendWelcomeEmail(String toEmail, String fullName) {
        String html = """
                 <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
                    <h2>Welcome to Ninety, %s!</h2>
                    <p>Your 90-day journey starts now. Consistency beats intensity - show up every day.</p>
                </div>
                """.formatted(fullName);
        return send(toEmail, "Welcome to Ninety", html);
    }

    private CompletableFuture<Void> send (String toEmail, String subject, String html){
        try{
            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from(fromEmail)
                    .to(toEmail)
                    .subject(subject)
                    .html(html)
                    .build();

            CreateEmailResponse response = client().emails().send(params);
            log.info("Email sent to {} (id={})", toEmail, response.getId());
            return CompletableFuture.completedFuture(null);
        }catch (Exception e){
            log.error("Failed to send email to {}", toEmail, e);
            throw new EmailDeliveryException("Failed to send email via Resend");
        }
    }
}
