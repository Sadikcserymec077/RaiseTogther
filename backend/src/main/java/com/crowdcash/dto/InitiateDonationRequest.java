package com.crowdcash.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class InitiateDonationRequest {
    private Long campaignId;
    private BigDecimal amount;
    private boolean isAnonymous;
    private String message;
    private Long rewardId; // nullable
}
