package com.akshay.ecom_project.repo;

import com.akshay.ecom_project.model.User;
import com.akshay.ecom_project.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistRepo extends JpaRepository<Wishlist, Long> {
    Optional<Wishlist> findByUser(User user);
    Optional<Wishlist> findByUserId(Long userId);
}
