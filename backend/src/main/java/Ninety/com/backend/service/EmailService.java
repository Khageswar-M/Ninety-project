package Ninety.com.backend.service;

import Ninety.com.backend.dto.request.SendOtpEmailRequest;

import java.util.concurrent.CompletableFuture;

public interface EmailService{
    /*
    * Sends an email asynchronously through Resend. Returns a future so callers
    *  can optionally await/observe failures without blocking the request thread.
    * */

    CompletableFuture<Void> sendOtpEmail(SendOtpEmailRequest request);

    CompletableFuture<Void> sendWelcomeEmail(String toEmail, String fullName);
}
