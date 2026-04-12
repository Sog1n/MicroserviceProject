package com.electronic.productservice.repository;

import com.electronic.productservice.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);

    List<Product> findTop5ByOrderBySoldDesc();

    List<Product> findByStatus(String status);

    List<Product> findBySellerId(Long sellerId);

    Optional<Product> findByName(String name);

}
