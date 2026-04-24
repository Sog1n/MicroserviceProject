package com.electronic.orderservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerService {
    private final KafkaTemplate<String, String> kafkaTemplate;
    private static final String TOPIC = "order-events";

    public void sendOrderMessage(String message) {
        log.info("🚀 [Order Service] Đang gửi sự kiện đơn hàng vào topic '{}': {}", TOPIC, message);
        kafkaTemplate.send(TOPIC, message);
        log.debug("✅ [Order Service] Hoàn tất gửi message!");
    }
}
