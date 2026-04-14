package com.electronic.orderservice.service;

import com.electronic.orderservice.model.*;
import com.electronic.orderservice.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cglib.core.Local;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final KafkaProducerService kafkaProducerService;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    @Value("${PRODUCT_SERVICE_URL:http://localhost:8081}")
    private String productServiceUrl;

    public Order createOrder(Order order)
    {
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        Order savedOrder = orderRepository.save(order);

        try
        {
            String orderJson = objectMapper.writeValueAsString(savedOrder);
            kafkaProducerService.sendOrderMessage(orderJson);

        }catch(Exception e)
        {
            System.err.println("[OrderService] Failed to send order event to Kafka: " + e.getMessage());
        }
        return savedOrder;
    }


    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getOrdersBySellerId(Long sellerId) {
        return orderRepository.findBySellerId(sellerId);
    }

    /** Admin: fetch all orders in the system. */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    /** Admin: update the status of an order. */
    public Order updateOrderStatus(Long orderId, String status)
    {
        return orderRepository.findById(orderId).map(order ->{
            order.setStatus(status);
            return orderRepository.save(order);
        })
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
    }

    /** Admin: delete an order. */
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
