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
            log.info("📥 [Product Service] Nhận được sự kiện từ Kafka: {}", message);
            JsonNode root = objectMapper.readTree(message);
            JsonNode items = root.get("items");

            if(items != null && items.isArray())
            {
                List<Map<String, Object>> itemList = objectMapper.convertValue(items, new TypeReference<List<Map<String, Object>>>(){});
                log.debug("📦 Đã bóc tách thành công {} sản phẩm từ message.", itemList.size());
            }

            if(items != null && items.isArray())
            {
                for(JsonNode item : items)
                {
                    JsonNode productIdNode = item.get("productId");
                    JsonNode quantityNode = item.get("quantity");

                    if(productIdNode == null || quantityNode == null)
                    {
                        log.warn("⚠️ Bỏ qua item vì thiếu thông tin 'productId' hoặc 'quantity': {}", item);
                        continue;
                    }


                    Long productId = productIdNode.asLong();
                    int quantity = quantityNode.asInt();
                    log.info("🔄 Bắt đầu trừ kho cho Sản phẩm ID: {}, Số lượng trừ: {}", productId, quantity);

                    productRepository.findById(productId).ifPresentOrElse(product -> {
                        int currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 50;
                        int currentSold = product.getSold() != null ? product.getSold() : 0;
                        product.setStockQuantity(currentStock - quantity);
                        product.setSold(currentSold + quantity);
                        productRepository.save(product);
                        log.info("✅ Cập nhật kho thành công (Sản phẩm ID: {}): Tồn kho mới = {}, Đã bán = {}",
                                productId, product.getStockQuantity(), product.getSold());
                    }, () -> log.error("❌ Không thể cập nhật kho! Không tìm thấy Sản phẩm với ID: {}", productId);
                });

                log.warn("⚠️ Cảnh báo: Message không chứa danh sách 'items' hợp lệ.");
                }
            }


        }catch (Exception e) {
            System.err.println("Error processing order event: " + e.getMessage());
            e.printStackTrace();
        }
    }

}
