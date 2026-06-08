package com.akshay.ecom_project.repo;

import com.akshay.ecom_project.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepo extends JpaRepository<Review, Long> {
    List<Review> findByProductId(int productId);
    Optional<Review> findByUserIdAndProductId(Long userId, int productId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(@Param("productId") int productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId")
    int countByProductId(@Param("productId") int productId);
}
