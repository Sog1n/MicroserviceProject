package com.electronic.discoveryservice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServiceApplication {

    private static final Logger log = LoggerFactory.getLogger(DiscoveryServiceApplication.class);

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(DiscoveryServiceApplication.class, args);
        Environment env = context.getEnvironment();
        String activeProfiles = String.join(",", env.getActiveProfiles());
        if (activeProfiles.isBlank()) {
            activeProfiles = "default";
        }

        log.info("✅🚀 {} started successfully on port {} (profiles: {})",
                env.getProperty("spring.application.name", "discovery-service"),
                env.getProperty("server.port", "unknown"),
                activeProfiles);
    }

}
