package com.akshay.ecom_project.service;

import com.akshay.ecom_project.dto.ReviewRequest;
import com.akshay.ecom_project.dto.ReviewResponse;
import com.akshay.ecom_project.model.Product;
import com.akshay.ecom_project.model.Review;
import com.akshay.ecom_project.model.User;
import com.akshay.ecom_project.repo.ProductRepo;
import com.akshay.ecom_project.repo.ReviewRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewService {

    @Autowired
    private ReviewRepo reviewRepo;

    @Autowired
    private ProductRepo productRepo;

    public Review addReview(User user, ReviewRequest request) {
        Product product = productRepo.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<Review> existingReviewOpt = reviewRepo.findByUserIdAndProductId(user.getId(), product.getId());

        Review review;
        if (existingReviewOpt.isPresent()) {
            review = existingReviewOpt.get();
            review.setRating(request.getRating());
            review.setComment(request.getComment());
        } else {
            review = new Review();
            review.setUser(user);
            review.setProduct(product);
            review.setRating(request.getRating());
            review.setComment(request.getComment());
        }

        return reviewRepo.save(review);
    }

    public List<ReviewResponse> getReviewsByProduct(int productId) {
        return reviewRepo.findByProductId(productId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public void deleteReview(User user, Long reviewId) {
        Review review = reviewRepo.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        boolean isAdmin = user.getRole() == User.Role.ROLE_ADMIN;
        if (!isAdmin && !review.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: You can only delete your own reviews");
        }

        reviewRepo.delete(review);
    }

    public Double getAverageRating(int productId) {
        Double avg = reviewRepo.getAverageRatingByProductId(productId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    public int getTotalReviews(int productId) {
        return reviewRepo.countByProductId(productId);
    }

    public ReviewResponse convertToResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt(),
                review.getUser().getName(),
                review.getUser().getId()
        );
    }
}
