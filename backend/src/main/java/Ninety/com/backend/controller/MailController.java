package Ninety.com.backend.controller;

import Ninety.com.backend.service.OtpService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/mail")
@RequiredArgsConstructor
@Tag(name = "Mailing", description = "Handle Resend mailing operations for Send OTP")
public class MailController {

    private OtpService otpService;



}
