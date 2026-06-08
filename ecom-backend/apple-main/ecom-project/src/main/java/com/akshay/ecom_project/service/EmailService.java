package com.akshay.ecom_project.service;

import com.akshay.ecom_project.model.Order;
import com.akshay.ecom_project.model.User;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Async
    public void sendWelcomeEmail(User user) {
        if (shouldSkipMail()) {
            System.out.println("SMTP not configured. Skipping welcome email to: " + user.getEmail());
            return;
        }
        try {
            Context context = new Context();
            context.setVariable("name", user.getName());
            String process = templateEngine.process("welcome-email", context);

            sendHtmlEmail(user.getEmail(), "Welcome to BuyThings!", process);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
    }

    @Async
    public void sendOrderConfirmation(Order order) {
        if (shouldSkipMail()) {
            System.out.println("SMTP not configured. Skipping order confirmation email to: " + order.getUser().getEmail());
            return;
        }
        try {
            Context context = new Context();
            context.setVariable("order", order);
            context.setVariable("name", order.getUser().getName());
            String process = templateEngine.process("order-confirmation", context);

            sendHtmlEmail(order.getUser().getEmail(), "Order Confirmation - #" + order.getId(), process);
        } catch (Exception e) {
            System.err.println("Failed to send order confirmation email: " + e.getMessage());
        }
    }

    @Async
    public void sendOrderShipped(Order order) {
        if (shouldSkipMail()) {
            System.out.println("SMTP not configured. Skipping order shipped email to: " + order.getUser().getEmail());
            return;
        }
        try {
            Context context = new Context();
            context.setVariable("order", order);
            context.setVariable("name", order.getUser().getName());
            String process = templateEngine.process("order-shipped", context);

            sendHtmlEmail(order.getUser().getEmail(), "Your Order Has Been Shipped! - #" + order.getId(), process);
        } catch (Exception e) {
            System.err.println("Failed to send order shipped email: " + e.getMessage());
        }
    }

    @Async
    public void sendOrderDelivered(Order order) {
        if (shouldSkipMail()) {
            System.out.println("SMTP not configured. Skipping order delivered email to: " + order.getUser().getEmail());
            return;
        }
        try {
            Context context = new Context();
            context.setVariable("order", order);
            context.setVariable("name", order.getUser().getName());
            String process = templateEngine.process("order-delivered", context);

            sendHtmlEmail(order.getUser().getEmail(), "Your Order Has Been Delivered! - #" + order.getId(), process);
        } catch (Exception e) {
            System.err.println("Failed to send order delivered email: " + e.getMessage());
        }
    }

    private boolean shouldSkipMail() {
        return mailSender == null || mailUsername == null || mailUsername.trim().isEmpty();
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) throws Exception {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
        helper.setFrom(mailUsername);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        mailSender.send(mimeMessage);
    }
}
