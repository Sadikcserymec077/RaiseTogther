package com.crowdcash.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class OverviewResponse {
    private long totalUsers;
    private long verifiedUsers;
    private long totalCampaigns;
    private long pendingCampaigns;
    private long approvedCampaigns;
    private long rejectedCampaigns;
    private BigDecimal totalDonationsAmount;
    private long totalDonationCount;
    private long totalReports;
    private long openReports;
    private BigDecimal avgDonationAmount;
    private long campaignsGoalAchieved;
}
