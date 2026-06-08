package com.akshay.ecom_project.service;

import com.akshay.ecom_project.dto.OrderRequest;
import com.akshay.ecom_project.model.Order;
import com.akshay.ecom_project.model.OrderItem;
import com.akshay.ecom_project.model.Product;
import com.akshay.ecom_project.model.User;
import com.akshay.ecom_project.repo.OrderRepo;
import com.akshay.ecom_project.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private CartService cartService;

    @Autowired
    private EmailService emailService;

    @Transactional
    public Order placeOrder(User user, OrderRequest request) {
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setOrderStatus(Order.OrderStatus.PENDING);
        order.setShippingAddress(request.getShippingAddress());

        BigDecimal total = BigDecimal.ZERO;
        boolean fromCart = false;

        List<OrderRequest.OrderItemRequest> itemsToProcess;
        if (request.getItems() == null || request.getItems().isEmpty()) {
            fromCart = true;
            com.akshay.ecom_project.model.Cart cart = cartService.getCartByUser(user);
            if (cart.getCartItems().isEmpty()) {
                throw new RuntimeException("Cart is empty");
            }
            itemsToProcess = cart.getCartItems().stream().map(item -> {
                OrderRequest.OrderItemRequest ir = new OrderRequest.OrderItemRequest();
                ir.setProductId(item.getProduct().getId());
                ir.setQuantity(item.getQuantity());
                return ir;
            }).collect(java.util.stream.Collectors.toList());
        } else {
            itemsToProcess = request.getItems();
        }

        for (OrderRequest.OrderItemRequest itemRequest : itemsToProcess) {
            Product product = productRepo.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemRequest.getProductId()));

            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice());

            order.getOrderItems().add(orderItem);
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));

            // Decrement stock
            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepo.save(product);
        }

        order.setTotalAmount(total);
        Order savedOrder = orderRepo.save(order);

        if (fromCart) {
            cartService.clearCart(user);
        }

        emailService.sendOrderConfirmation(savedOrder);

        return savedOrder;
    }

    public List<Order> getOrdersByUser(User user) {
        return orderRepo.findByUserOrderByOrderDateDesc(user);
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAllByOrderByOrderDateDesc();
    }

    public Order getOrderById(Long id) {
        return orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status.toUpperCase());
        order.setOrderStatus(newStatus);
        Order savedOrder = orderRepo.save(order);

        if (newStatus == Order.OrderStatus.SHIPPED) {
            emailService.sendOrderShipped(savedOrder);
        } else if (newStatus == Order.OrderStatus.DELIVERED) {
            emailService.sendOrderDelivered(savedOrder);
        }

        return savedOrder;
    }
}
