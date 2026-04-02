package com.electronic.productservice.service;

import com.electronic.productservice.model.Category;
import com.electronic.productservice.model.Product;
import com.electronic.productservice.model.Review;
import com.electronic.productservice.repository.CategoryRepository;
import com.electronic.productservice.repository.ProductRepository;
import com.electronic.productservice.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;

    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }


    public void updateProductRating(Long productId){
        productRepository.findById(productId).ifPresent(product -> {
            List<Review> reviews = reviewRepository.findByProductId(productId);
            if(reviews.isEmpty())
            {
                product.setVotes(0);
                product.setRate(0.0);
            }
            else
            {
                double avg = reviews.stream()
                        .mapToInt(Review::getRating)
                        .average()
                        .orElse(0.0);
                product.setVotes(reviews.size());
                product.setRate(avg);
            }
            productRepository.save(product);

        });
    }

    public Review addReview(Review review)
    {
        if(review.getDate() == null)
        {
            review.setDate(java.time.LocalDateTime.now());
        }
        Review savedReview = reviewRepository.save(review);
        updateProductRating(review.getProductId());
        return savedReview;
    }

    public Review updateReview(Long reviewId, Review newReview)
    {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));
        review.setRating(newReview.getRating());
        review.setComment(newReview.getComment());
        review.setDate(java.time.LocalDateTime.now());
        Review save = reviewRepository.save(review);
        updateProductRating(review.getProductId());
        return save;
    }

    public void deleteReview(Long reviewId)
    {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));
        Long productId = review.getProductId();
        reviewRepository.deleteById(reviewId);
        updateProductRating(productId);
    }

    public List<Product> getAllProducts() {
        return productRepository.findByStatus("APPROVED");
    }

    public List<Product> getProductsByStatus(String status){
        return productRepository.findByStatus(status);
    }

    public List<Product> getProductsBySellerId(Long sellerId){
        return productRepository.findBySellerId(sellerId);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public Product saveProduct(Product product)
    {
        if(product.getAddedDate() == null || product.getAddedDate().isEmpty())
        {
            product.setAddedDate(java.time.LocalDate.now().toString());
        }

        if(product.getRate()  == null) product.setRate(0.0);
        if(product.getVotes() == null) product.setVotes(0);
        if(product.getSold() == null) product.setSold(0);
        if(product.getStockQuantity() == null) product.setStockQuantity(50);
        if(product.getStatus() == null || product.getStatus().isEmpty()) product.setStatus("PENDING");
        if(product.getQuantity() == null) product.setQuantity(1);

        return productRepository.save(product);
    }

    @org.springframework.transaction.annotation.Transactional
    public void reduceStock(List<Map<String, Object>> items) {
        for(Map<String, Object> item : items)
        {
            Long productId = Long.valueOf(item.get("productId").toString());
            Integer quantity = Integer.valueOf(item.get("quantity").toString());

            productRepository.findById(productId).ifPresent(product -> {
                int currentStock = (product.getStockQuantity() != null) ? product.getStockQuantity() : 50;
                int currentSold = (product.getSold() != null) ? product.getSold() : 0;
                product.setStockQuantity(Math.max(0, currentStock - quantity));
                product.setSold(currentSold + quantity);
                productRepository.save(product);
            });
        }
    }

    public Product updateProduct(Long id, Product updatedProduct)
    {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        if(updatedProduct.getName() != null) product.setName(updatedProduct.getName());
        if(updatedProduct.getShortName() != null) product.setShortName(updatedProduct.getShortName());
        if(updatedProduct.getCategory() != null) product.setCategory(updatedProduct.getCategory());
        if(updatedProduct.getPrice() != null) product.setPrice(updatedProduct.getPrice());
        if(updatedProduct.getDiscount() != null) product.setDiscount(updatedProduct.getDiscount());
        if(updatedProduct.getDescription() != null) product.setDescription(updatedProduct.getDescription());
        if(updatedProduct.getStockQuantity() != null) product.setStockQuantity(updatedProduct.getStockQuantity());
        if(updatedProduct.getImg() != null) product.setImg(updatedProduct.getImg());

        if(updatedProduct.getStatus() != null) product.setStatus(updatedProduct.getStatus());
        if(updatedProduct.getQuantity() != null) product.setQuantity(updatedProduct.getQuantity());
        if(updatedProduct.getSellerId() != null) product.setSellerId(updatedProduct.getSellerId());
        if(updatedProduct.getAddedDate() != null) product.setAddedDate(updatedProduct.getAddedDate());
        if(updatedProduct.getOtherImages() != null) product.setOtherImages(updatedProduct.getOtherImages());
        if(updatedProduct.getColors() != null) product.setColors(updatedProduct.getColors());
        if(updatedProduct.getSizes() != null) product.setSizes(updatedProduct.getSizes());

        return productRepository.save(product);
    }

    public List<Product> getTopSellingProducts()
    {
        return productRepository.findTop5ByOrderBySoldDesc();
    }

    public void deleteProduct(Long id)
    {
        if(!productRepository.existsById(id))
            throw new RuntimeException("Product not found with id: " + id);
        productRepository.deleteById(id);
    }

    // Category management

    public List<Category> getAllCategories()
    {
        return categoryRepository.findAll();
    }

    public Category createCategory(Category category)
    {
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category updatedCategory)
    {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        if(updatedCategory.getName() != null) category.setName(updatedCategory.getName());
        if(updatedCategory.getDisplayName() != null) category.setDisplayName(updatedCategory.getDisplayName());
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id)
    {
        if(!categoryRepository.existsById(id))
            throw new RuntimeException("Category not found with id: " + id);
        categoryRepository.deleteById(id);
    }

}
