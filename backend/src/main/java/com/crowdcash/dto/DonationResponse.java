package com.crowdcash.dto;

import com.crowdcash.model.enums.DonationStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonationResponse {
    private Long id;
    private BigDecimal amount;
    private Boolean isAnonymous;
    private String message;
    private DonationStatus status;
    private Long campaignId;
    private String campaignTitle;
    private String campaignThumbnail;
    private String donorName;
    private String rewardTitle;
    private String receiptNumber;
    private String paymentId;
    private LocalDateTime createdAt;
}
