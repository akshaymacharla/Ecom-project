package com.akshay.ecom_project.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private List<OrderItemRequest> items;
    private String shippingAddress;

    @Data
    public static class OrderItemRequest {
        private int productId;
        private int quantity;
    }
}
