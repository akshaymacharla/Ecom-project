package com.akshay.ecom_project.service;

import com.akshay.ecom_project.model.Product;
import com.akshay.ecom_project.model.User;
import com.akshay.ecom_project.model.Wishlist;
import com.akshay.ecom_project.repo.ProductRepo;
import com.akshay.ecom_project.repo.WishlistRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class WishlistService {

    @Autowired
    private WishlistRepo wishlistRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private CartService cartService;

    public Wishlist getWishlistByUser(User user) {
        return wishlistRepo.findByUser(user).orElseGet(() -> {
            Wishlist wishlist = new Wishlist();
            wishlist.setUser(user);
            return wishlistRepo.save(wishlist);
        });
    }

    public Wishlist addToWishlist(User user, int productId) {
        Wishlist wishlist = getWishlistByUser(user);
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        wishlist.getProducts().add(product);
        return wishlistRepo.save(wishlist);
    }

    public Wishlist removeFromWishlist(User user, int productId) {
        Wishlist wishlist = getWishlistByUser(user);
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        wishlist.getProducts().remove(product);
        return wishlistRepo.save(wishlist);
    }

    public void moveToCart(User user, int productId) {
        cartService.addToCart(user, productId, 1);
        removeFromWishlist(user, productId);
    }
}
