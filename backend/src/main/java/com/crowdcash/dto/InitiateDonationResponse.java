package com.crowdcash.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InitiateDonationResponse {
    private String razorpayOrderId;
    private BigDecimal amount;
    private String currency;
    private String razorpayKeyId;
    private Long donationId;
    private String campaignTitle;
    private String donorName;
    private String donorEmail;
}
