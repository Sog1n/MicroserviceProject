package com.electronic.userservice.service;

import com.electronic.userservice.config.JwtUtils;
import com.electronic.userservice.model.AuthResponse;
import com.electronic.userservice.model.User;
import com.electronic.userservice.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    @Value("${google.client-id}")
    private String googleClientId;

    public AuthResponse authenticate(String idTokenString) {
        if (!StringUtils.hasText(idTokenString)) {
            throw new RuntimeException("Google idToken is required");
        }

        GoogleIdToken idToken = verifyGoogleToken(idTokenString);
        GoogleIdToken.Payload payload = idToken.getPayload();

        String email = payload.getEmail();
        if (!StringUtils.hasText(email)) {
            throw new RuntimeException("Google account does not contain email");
        }

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createUserFromGooglePayload(payload));

        return AuthResponse.builder()
                .accessToken(jwtUtils.generateAccessToken(user.getUsername()))
                .refreshToken(jwtUtils.generateRefreshToken(user.getUsername()))
                .user(user)
                .build();
    }

    private GoogleIdToken verifyGoogleToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new RuntimeException("Invalid Google token");
            }
            return idToken;
        } catch (GeneralSecurityException | IOException e) {
            throw new RuntimeException("Google token verification failed", e);
        }
    }

    private User createUserFromGooglePayload(GoogleIdToken.Payload payload) {
        String email = payload.getEmail();
        String usernameBase = email.split("@")[0].toLowerCase(Locale.ROOT);
        String username = generateUniqueUsername(usernameBase);

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setFullName((String) payload.get("name"));
        user.setRole("USER");
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));

        return userRepository.save(user);
    }

    private String generateUniqueUsername(String base) {
        String safeBase = StringUtils.hasText(base) ? base : "user";
        String candidate = safeBase;
        int counter = 1;

        while (userRepository.findByUsername(candidate).isPresent()) {
            candidate = safeBase + counter;
            counter++;
        }

        return candidate;
    }
}

