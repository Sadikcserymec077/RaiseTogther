package com.crowdcash.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignDonationStatsResponse {
    private BigDecimal totalRaised;
    private long donorCount;
    private BigDecimal goalAmount;
    private double progressPercent;
    private List<DonorSummary> topDonors;
    private List<DonorSummary> recentDonors;
}
