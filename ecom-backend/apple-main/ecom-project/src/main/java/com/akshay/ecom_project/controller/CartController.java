package com.akshay.ecom_project.controller;

import com.akshay.ecom_project.dto.AddToCartRequest;
import com.akshay.ecom_project.dto.CartResponse;
import com.akshay.ecom_project.dto.UpdateCartRequest;
import com.akshay.ecom_project.model.Cart;
import com.akshay.ecom_project.model.User;
import com.akshay.ecom_project.service.CartService;
import com.akshay.ecom_project.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
@PreAuthorize("isAuthenticated()")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        Cart cart = cartService.getCartByUser(user);
        return ResponseEntity.ok(cartService.convertToResponse(cart));
    }

    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        Cart cart = cartService.addToCart(user, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(cartService.convertToResponse(cart));
    }

    @PutMapping("/update")
    public ResponseEntity<CartResponse> updateCart(
            @Valid @RequestBody UpdateCartRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        Cart cart = cartService.updateCartItemQuantity(user, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(cartService.convertToResponse(cart));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<CartResponse> removeFromCart(
            @PathVariable int productId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        Cart cart = cartService.removeCartItem(user, productId);
        return ResponseEntity.ok(cartService.convertToResponse(cart));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<CartResponse> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        Cart cart = cartService.clearCart(user);
        return ResponseEntity.ok(cartService.convertToResponse(cart));
    }
}
