package com.crowdcash.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal minimumAmount;
    private String imageUrl;
    private Integer totalClaimed;
    private Integer maxClaims;
    private boolean isAvailable; // false if maxClaims reached
}
