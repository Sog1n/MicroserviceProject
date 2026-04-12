package com.electronic.userservice.controller;

import com.electronic.userservice.model.User;
import com.electronic.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<User> updateProfile(@PathVariable Long id, @RequestBody User request) {
        return ResponseEntity.ok(userService.updateProfile(id, request));
    }

    @GetMapping("/users/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(userService.search(q));
    }

    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAll());
    }

    @DeleteMapping("/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}

