package com.crowdcash.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationEventMessage {
    private String type;          // "NEW_DONATION" | "GOAL_ACHIEVED"
    private Long campaignId;
    private BigDecimal raisedAmount;
    private BigDecimal goalAmount;
    private double progressPercent;
    private int donorCount;
    private String donorDisplayName;  // "Anonymous" or first name
    private BigDecimal donationAmount;
    private LocalDateTime timestamp;
}
