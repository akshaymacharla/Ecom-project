package com.akshay.ecom_project.dto;

import com.akshay.ecom_project.model.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponse {
    private Long id;
    private Product product;
    private int quantity;
}
