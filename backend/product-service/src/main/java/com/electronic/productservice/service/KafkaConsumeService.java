package com.electronic.productservice.service;

import com.electronic.productservice.repository.ProductRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class KafkaConsumeService {
    private final ObjectMapper objectMapper;
    private final ProductRepository productRepository;

    @org.springframework.transaction.annotation.Transactional
    @KafkaListener(topics = "order-events", groupId = "product-group")
    public void consumeOrderEvent(String message)
    {

        try
        {
            System.out.println("Processing order event: " + message);
            JsonNode root = objectMapper.readTree(message);
            JsonNode items = root.get("items");

            if(items != null && items.isArray())
            {
                List<Map<String, Object>> itemList = objectMapper.convertValue(items, new TypeReference<List<Map<String, Object>>>(){});
            }

            if(items != null && items.isArray())
            {
                for(JsonNode item : items)
                {
                    JsonNode productIdNode = item.get("productId");
                    JsonNode quantityNode = item.get("quantity");

                    if(productIdNode == null || quantityNode == null)
                        continue;

                    Long productId = productIdNode.asLong();
                    int quantity = quantityNode.asInt();


                    productRepository.findById(productId).ifPresentOrElse(product -> {
                        int currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 50;
                        int currentSold = product.getSold() != null ? product.getSold() : 0;
                        product.setStockQuantity(currentStock - quantity);
                        product.setSold(currentSold + quantity);
                        productRepository.save(product);
                        System.out.println("Updated product " + productId + ": stock=" + product.getStockQuantity()
                                + ", sold=" + product.getSold());
                    }, () -> System.err.println("Product not found: " + productId));

                    System.out.println("Kafka event received for product " + productId + " (skipping stock update as REST call handles it)");
                }
            }


        }catch (Exception e) {
            System.err.println("Error processing order event: " + e.getMessage());
            e.printStackTrace();
        }
    }

}
