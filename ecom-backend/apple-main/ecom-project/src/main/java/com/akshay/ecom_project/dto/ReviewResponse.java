package com.akshay.ecom_project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponse {
    private Long id;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private String reviewerName;
    private Long reviewerId;
}
