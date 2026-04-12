package com.electronic.apigateway.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Value("${spring.application.name:api-gateway}")
    private String serviceName;

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "service", serviceName,
                "status", "UP",
                "timestamp", Instant.now().toString()
        ));
    }
}

