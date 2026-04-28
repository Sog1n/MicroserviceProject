package com.electronic.userservice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class UserServiceApplication {

    private static final Logger log = LoggerFactory.getLogger(UserServiceApplication.class);

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(UserServiceApplication.class, args);
        Environment env = context.getEnvironment();
        String activeProfiles = String.join(",", env.getActiveProfiles());
        if (activeProfiles.isBlank()) {
            activeProfiles = "default";
        }

        log.info("✅🚀 {} started successfully on port {} (profiles: {})",
                env.getProperty("spring.application.name", "user-service"),
                env.getProperty("server.port", "unknown"),
                activeProfiles);
    }

}
