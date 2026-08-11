package Ninety.com.backend.service.serviceImpl;

import Ninety.com.backend.exception.EmailDeliveryException;
import Ninety.com.backend.service.EmailService;
import Ninety.com.backend.service.OtpService;
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

    private final OtpService otpService;

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from-email}")
    private String fromEmail;

    private Resend client(){
        return new Resend(apiKey);
    }


    @Override
    @Async
    public CompletableFuture<Void> sendOtpEmail(String toEmail, String fullName) {

        String otp = otpService.generateAndStoreOtp(toEmail);

        String html = """
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
                    <h2>Verify your Ninety Productive Day Tracker account</h2>
                    <p>Hi %s,</p>
                    <p>Your verification code is: </p>
                    <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px;">%s</p>
                    <p>This code is valid for 10 minutes. If you didn't request this, you can ignore this email.</p>
                </div>
                """.formatted(fullName, otp);

        return send(toEmail, "Your Ninety verification code", html);

    }

    @Override
    @Async
    public CompletableFuture<Void> sendWelcomeEmail(String toEmail, String fullName) {
        String html = """
                 <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
                    <h2>Welcome to Ninety Productive Day's Tracker, %s!</h2>
                    <p>Your 90-day journey starts now. Consistency beats intensity - show up every day.</p>
                </div>
                """.formatted(fullName);
        return send(toEmail, "Welcome to Ninety", html);
    }

    @Override
    public CompletableFuture<Void> sendPasswordResetOtp(String toEmail) {
        String otp = otpService.generateAndStoreOtp(toEmail);

        String html = """
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
                <h2>Reset your Ninety account password</h2>

                <p>Hi,</p>

                <p>We received a request to reset your password.</p>

                <p>Your password reset verification code is:</p>

                <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px;">
                    %s
                </p>

                <p>
                    This code is valid for 10 minutes.
                    If you didn't request a password reset, you can safely ignore this email.
                </p>

                <p>Thanks,<br>Ninety Team</p>
            </div>
            """.formatted(otp);

        return send(toEmail, "Ninety Productive Day's Tracker - Password Verification code", html);
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
