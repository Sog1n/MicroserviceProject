package com.electronic.userservice.service;

import com.electronic.userservice.model.Otp;
import com.electronic.userservice.model.User;
import com.electronic.userservice.repository.OtpRepository;
import com.electronic.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:no-reply@example.com}")
    private String senderEmail;

    public void sendOtp(String loginKey) {
        if (!StringUtils.hasText(loginKey)) {
            throw new RuntimeException("loginKey is required");
        }

        User user = userRepository.findByUsername(loginKey)
                .or(() -> userRepository.findByEmail(loginKey))
                .or(() -> userRepository.findByPhone(loginKey))
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!StringUtils.hasText(user.getEmail())) {
            throw new RuntimeException("User does not have an email");
        }

        otpRepository.deleteByLoginKey(loginKey);

        String code = String.format("%06d", ThreadLocalRandom.current().nextInt(1_000_000));
        Otp otp = Otp.builder()
                .loginKey(loginKey)
                .code(code)
                .expiryTime(LocalDateTime.now().plusMinutes(5))
                .build();

        otpRepository.save(otp);
        sendOtpMail(user.getEmail(), code);
    }

    public void verifyOtp(String loginKey, String code) {
        if (!StringUtils.hasText(loginKey) || !StringUtils.hasText(code)) {
            throw new RuntimeException("loginKey and code are required");
        }

        Otp otp = otpRepository.findByLoginKeyAndCode(loginKey, code)
                .orElseThrow(() -> new RuntimeException("Invalid OTP"));

        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpRepository.deleteByLoginKey(loginKey);
            throw new RuntimeException("OTP has expired");
        }

        otpRepository.deleteByLoginKey(loginKey);
    }

    private void sendOtpMail(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderEmail);
        message.setTo(toEmail);
        message.setSubject("Your OTP code");
        message.setText("Your OTP is " + otpCode + ". This code will expire in 5 minutes.");
        mailSender.send(message);
    }
}

