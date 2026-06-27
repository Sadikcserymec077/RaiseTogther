package com.crowdcash.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class UserDashboardSummaryResponse {
    private int totalCampaignsCreated;
    private int activeCampaigns;
    private BigDecimal totalRaisedAcrossCampaigns;
    private int totalDonationsMade;
    private BigDecimal totalAmountDonated;
    private int bookmarkCount;
    private int unreadNotifications;
    private List<BadgeResponse> recentBadges;
}
