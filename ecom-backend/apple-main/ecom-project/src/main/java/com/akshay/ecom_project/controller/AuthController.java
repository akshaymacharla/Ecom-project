package com.akshay.ecom_project.controller;

import com.akshay.ecom_project.dto.AuthResponse;
import com.akshay.ecom_project.dto.LoginRequest;
import com.akshay.ecom_project.dto.RegisterRequest;
import com.akshay.ecom_project.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
@Tag(name = "Authentication", description = "Endpoints for user registration, login, and logout")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = userService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    @Operation(summary = "User login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
        }
    }

    @PostMapping("/logout")
    @Operation(summary = "User logout (client-side only)")
    public ResponseEntity<?> logout() {
        // JWT is stateless — logout is handled on the client side by removing the token
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
