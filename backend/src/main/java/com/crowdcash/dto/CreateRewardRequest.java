package com.crowdcash.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateRewardRequest {
    private String title;
    private String description;
    private BigDecimal minimumAmount;
    private Integer maxClaims;
    private String imageUrl;
}
