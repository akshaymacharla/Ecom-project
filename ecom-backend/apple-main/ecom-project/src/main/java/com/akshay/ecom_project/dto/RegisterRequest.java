package com.akshay.ecom_project.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role; // "ROLE_ADMIN" or "ROLE_USER" (defaults to ROLE_USER if blank)
}
