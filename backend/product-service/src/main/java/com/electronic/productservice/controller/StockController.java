package com.electronic.productservice.controller;

import com.electronic.productservice.model.Product;
import com.electronic.productservice.service.ProductService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class StockController {
    private final ProductService productService;
    @PostMapping("/reduce-stock")
    @Transactional
    public ResponseEntity<?> reduceStock(@RequestBody List<Map<String, Object>> items) {
        productService.reduceStock(items);
        return ResponseEntity.ok(Map.of("status", "updated"));
    }
}
