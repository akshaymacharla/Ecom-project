package com.akshay.ecom_project.service;

import com.akshay.ecom_project.dto.CartItemResponse;
import com.akshay.ecom_project.dto.CartResponse;
import com.akshay.ecom_project.model.Cart;
import com.akshay.ecom_project.model.CartItem;
import com.akshay.ecom_project.model.Product;
import com.akshay.ecom_project.model.User;
import com.akshay.ecom_project.repo.CartItemRepo;
import com.akshay.ecom_project.repo.CartRepo;
import com.akshay.ecom_project.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private CartItemRepo cartItemRepo;

    @Autowired
    private ProductRepo productRepo;

    public Cart getCartByUser(User user) {
        return cartRepo.findByUser(user).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepo.save(cart);
        });
    }

    public Cart addToCart(User user, int productId, int quantity) {
        Cart cart = getCartByUser(user);
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock for product: " + product.getName());
        }

        Optional<CartItem> existingItemOpt = cartItemRepo.findByCartIdAndProductId(cart.getId(), productId);

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            int newQuantity = existingItem.getQuantity() + quantity;
            if (product.getStockQuantity() < newQuantity) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            existingItem.setQuantity(newQuantity);
            cartItemRepo.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cartItemRepo.save(newItem);
            cart.getCartItems().add(newItem);
        }

        return cartRepo.save(cart);
    }

    public Cart updateCartItemQuantity(User user, int productId, int quantity) {
        Cart cart = getCartByUser(user);
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock for product: " + product.getName());
        }

        CartItem cartItem = cartItemRepo.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        cartItem.setQuantity(quantity);
        cartItemRepo.save(cartItem);

        return cartRepo.save(cart);
    }

    public Cart removeCartItem(User user, int productId) {
        Cart cart = getCartByUser(user);
        CartItem cartItem = cartItemRepo.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        cart.getCartItems().remove(cartItem);
        cartItemRepo.delete(cartItem);

        return cartRepo.save(cart);
    }

    public Cart clearCart(User user) {
        Cart cart = getCartByUser(user);
        cartItemRepo.deleteAll(cart.getCartItems());
        cart.getCartItems().clear();
        return cartRepo.save(cart);
    }

    public CartResponse convertToResponse(Cart cart) {
        List<CartItemResponse> items = cart.getCartItems().stream()
                .map(item -> new CartItemResponse(item.getId(), item.getProduct(), item.getQuantity()))
                .collect(Collectors.toList());
        return new CartResponse(cart.getId(), items);
    }
}
