package Ninety.com.backend.service;

import java.util.concurrent.CompletableFuture;

public interface EmailService{
    CompletableFuture<Void> sendOtpEmail(String toEmail, String fullName);

    CompletableFuture<Void> sendWelcomeEmail(String toEmail, String fullName);
}
