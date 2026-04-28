package com.electronic.productservice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class ProductServiceApplication {

    private static final Logger log = LoggerFactory.getLogger(ProductServiceApplication.class);

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(ProductServiceApplication.class, args);
        Environment env = context.getEnvironment();
        String activeProfiles = String.join(",", env.getActiveProfiles());
        if (activeProfiles.isBlank()) {
            activeProfiles = "default";
        }

        log.info("✅🚀 {} started successfully on port {} (profiles: {})",
                env.getProperty("spring.application.name", "product-service"),
                env.getProperty("server.port", "unknown"),
                activeProfiles);
    }

}
