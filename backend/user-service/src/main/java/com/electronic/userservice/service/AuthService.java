package com.electronic.userservice.service;

import com.electronic.userservice.config.JwtUtils;
import com.electronic.userservice.model.AuthResponse;
import com.electronic.userservice.model.LoginRequest;
import com.electronic.userservice.model.User;
import com.electronic.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public User register(User request) {
        if (!StringUtils.hasText(request.getUsername()) || !StringUtils.hasText(request.getPassword())) {
            throw new RuntimeException("Username and password are required");
        }

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (StringUtils.hasText(request.getEmail()) && userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (StringUtils.hasText(request.getPhone()) && userRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new RuntimeException("Phone already exists");
        }

        if (!StringUtils.hasText(request.getRole())) {
            request.setRole("USER");
        }

        request.setPassword(passwordEncoder.encode(request.getPassword()));
        return userRepository.save(request);
    }

    public AuthResponse login(LoginRequest request) {
        if (!StringUtils.hasText(request.getPassword())) {
            throw new RuntimeException("Password is required");
        }

        String loginKey = request.getUsername();
        if (!StringUtils.hasText(loginKey)) {
            throw new RuntimeException("Username/email/phone is required");
        }

        User user = login(loginKey, request.getPassword())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        return AuthResponse.builder()
                .accessToken(jwtUtils.generateAccessToken(user.getUsername()))
                .refreshToken(jwtUtils.generateRefreshToken(user.getUsername()))
                .user(user)
                .build();
    }

    public Optional<User> login(String loginKey, String password) {
        Optional<User> user = userRepository.findByUsername(loginKey);
        if (user.isEmpty()) {
            user = userRepository.findByEmail(loginKey);
        }
        if (user.isEmpty()) {
            user = userRepository.findByPhone(loginKey);
        }
        return user.filter(u -> passwordEncoder.matches(password, u.getPassword()));
    }
}
