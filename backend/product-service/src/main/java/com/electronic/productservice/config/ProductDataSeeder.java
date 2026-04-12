package com.electronic.productservice.config;

import com.electronic.productservice.model.Product;
import com.electronic.productservice.model.ProductColor;
import com.electronic.productservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class ProductDataSeeder {

    private final ProductRepository productRepository;

    @Bean
    public CommandLineRunner seedSampleProducts() {
        return args -> {
            List<Product> samples = List.of(
                    buildProduct(
                            "iPhone 15 Pro Max",
                            "iPhone 15 PM",
                            "Flagship smartphone with A17 Pro, titanium frame, and advanced camera system.",
                            32990000.0,
                            5,
                            "smartphone",
                            "https://images.example.com/iphone-15-pro-max.jpg",
                            120,
                            320,
                            4.8,
                            210,
                            List.of("Black", "Blue", "White"),
                            List.of("256GB", "512GB", "1TB")
                    ),
                    buildProduct(
                            "Samsung Galaxy S24 Ultra",
                            "Galaxy S24 Ultra",
                            "Premium Android phone with Snapdragon chipset, S Pen, and AI camera features.",
                            30990000.0,
                            7,
                            "smartphone",
                            "https://images.example.com/galaxy-s24-ultra.jpg",
                            100,
                            270,
                            4.7,
                            180,
                            List.of("Titanium Gray", "Violet"),
                            List.of("256GB", "512GB")
                    ),
                    buildProduct(
                            "MacBook Air M3 13-inch",
                            "MacBook Air M3",
                            "Lightweight laptop with Apple M3 chip, long battery life, and Liquid Retina display.",
                            28490000.0,
                            10,
                            "laptop",
                            "https://images.example.com/macbook-air-m3.jpg",
                            60,
                            150,
                            4.9,
                            96,
                            List.of("Midnight", "Silver", "Starlight"),
                            List.of("8GB/256GB", "16GB/512GB")
                    ),
                    buildProduct(
                            "Sony WH-1000XM5",
                            "Sony XM5",
                            "Noise-cancelling wireless headphones with premium sound and 30-hour battery.",
                            7990000.0,
                            12,
                            "audio",
                            "https://images.example.com/sony-wh1000xm5.jpg",
                            200,
                            410,
                            4.6,
                            260,
                            List.of("Black", "Silver"),
                            List.of("Standard")
                    ),
                    buildProduct(
                            "Xiaomi Redmi Pad Pro",
                            "Redmi Pad Pro",
                            "Affordable tablet with large 12.1-inch display and quad speakers.",
                            8990000.0,
                            15,
                            "tablet",
                            "https://images.example.com/redmi-pad-pro.jpg",
                            90,
                            140,
                            4.5,
                            85,
                            List.of("Gray", "Green"),
                            List.of("6GB/128GB", "8GB/256GB")
                    )
            );

            int inserted = 0;
            for (Product sample : samples) {
                if (productRepository.findByName(sample.getName()).isPresent()) {
                    continue;
                }
                productRepository.save(sample);
                inserted++;
            }

            System.out.println("[ProductDataSeeder] inserted sample products: " + inserted);
            System.out.println("[ProductDataSeeder] total products now: " + productRepository.count());
        };
    }

    private Product buildProduct(
            String name,
            String shortName,
            String description,
            Double price,
            Integer discount,
            String category,
            String img,
            Integer stockQuantity,
            Integer sold,
            Double rate,
            Integer votes,
            List<String> colorNames,
            List<String> sizes
    ) {
        Product product = new Product();
        product.setName(name);
        product.setShortName(shortName);
        product.setDescription(description);
        product.setPrice(price);
        product.setDiscount(discount);
        product.setCategory(category);
        product.setImg(img);
        product.setAddedDate(LocalDate.now().toString());
        product.setStockQuantity(stockQuantity);
        product.setSold(sold);
        product.setRate(rate);
        product.setVotes(votes);
        product.setQuantity(1);
        product.setStatus("APPROVED");
        product.setSellerId(1L);

        product.setOtherImages(List.of(img));
        product.setSizes(sizes);
        product.setColors(colorNames.stream()
                .map(color -> new ProductColor(null, color, color.toLowerCase().replace(" ", "-")))
                .toList());

        return product;
    }
}

