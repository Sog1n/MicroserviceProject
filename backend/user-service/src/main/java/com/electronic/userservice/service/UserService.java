package com.electronic.userservice.service;

import com.electronic.userservice.model.User;
import com.electronic.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public List<User> search(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return userRepository.findAll();
        }

        String normalized = keyword.toLowerCase(Locale.ROOT);
        return userRepository.findAll().stream()
                .filter(user -> containsIgnoreCase(user.getUsername(), normalized)
                        || containsIgnoreCase(user.getEmail(), normalized)
                        || containsIgnoreCase(user.getPhone(), normalized))
                .collect(Collectors.toList());
    }

    public User updateProfile(Long id, User request) {
        User user = getById(id);

        if (StringUtils.hasText(request.getUsername())
                && !Objects.equals(user.getUsername(), request.getUsername())
                && userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (StringUtils.hasText(request.getEmail())
                && !Objects.equals(user.getEmail(), request.getEmail())
                && userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (StringUtils.hasText(request.getPhone())
                && !Objects.equals(user.getPhone(), request.getPhone())
                && userRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new RuntimeException("Phone already exists");
        }

        if (StringUtils.hasText(request.getUsername())) {
            user.setUsername(request.getUsername());
        }
        if (StringUtils.hasText(request.getEmail())) {
            user.setEmail(request.getEmail());
        }
        if (StringUtils.hasText(request.getPhone())) {
            user.setPhone(request.getPhone());
        }
        if (StringUtils.hasText(request.getFullName())) {
            user.setFullName(request.getFullName());
        }
        if (StringUtils.hasText(request.getAddress())) {
            user.setAddress(request.getAddress());
        }
        if (StringUtils.hasText(request.getRole())) {
            user.setRole(request.getRole());
        }

        return userRepository.save(user);
    }

    public void deleteById(Long id) {
        if (userRepository.findById(id).isEmpty()) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    private boolean containsIgnoreCase(String value, String keywordLowerCase) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(keywordLowerCase);
    }
}

