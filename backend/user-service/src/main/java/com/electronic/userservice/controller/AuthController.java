package com.electronic.userservice.controller;

import com.electronic.userservice.model.AuthResponse;
import com.electronic.userservice.model.LoginRequest;
import com.electronic.userservice.model.User;
import com.electronic.userservice.service.AuthService;
import com.electronic.userservice.service.GoogleAuthService;
import com.electronic.userservice.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final GoogleAuthService googleAuthService;
    private final OtpService otpService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleAuth(@RequestBody Map<String, String> body) {
        String idToken = body.get("idToken");
        return ResponseEntity.ok(googleAuthService.authenticate(idToken));
    }

    @PostMapping("/otp/send")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody Map<String, String> body) {
        otpService.sendOtp(body.get("loginKey"));
        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody Map<String, String> body) {
        otpService.verifyOtp(body.get("loginKey"), body.get("code"));
        return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
    }
}

