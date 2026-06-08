package com.akshay.ecom_project.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class AddToCartRequest {
    private int productId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;
}
