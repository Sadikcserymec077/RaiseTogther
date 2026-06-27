package com.crowdcash.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonationSuccessResponse {
    private Long donationId;
    private String receiptNumber;
    private BigDecimal amount;
    private String campaignTitle;
    private String rewardTitle; // nullable
    private String message;
    private String paymentId;
}
