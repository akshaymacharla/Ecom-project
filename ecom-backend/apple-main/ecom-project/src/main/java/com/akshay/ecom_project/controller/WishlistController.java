package com.akshay.ecom_project.controller;

import com.akshay.ecom_project.model.User;
import com.akshay.ecom_project.model.Wishlist;
import com.akshay.ecom_project.service.UserService;
import com.akshay.ecom_project.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin
@PreAuthorize("isAuthenticated()")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<Wishlist> getWishlist(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        Wishlist wishlist = wishlistService.getWishlistByUser(user);
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<Wishlist> addToWishlist(
            @PathVariable int productId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        Wishlist wishlist = wishlistService.addToWishlist(user, productId);
        return ResponseEntity.ok(wishlist);
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Wishlist> removeFromWishlist(
            @PathVariable int productId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        Wishlist wishlist = wishlistService.removeFromWishlist(user, productId);
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/move-to-cart/{productId}")
    public ResponseEntity<String> moveToCart(
            @PathVariable int productId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        wishlistService.moveToCart(user, productId);
        return ResponseEntity.ok("Item moved to cart");
    }
}
