package com.crowdcash.service;

import com.crowdcash.dto.UserDashboardSummaryResponse;
import com.crowdcash.repository.CampaignRepository;
import com.crowdcash.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDashboardService {
    private final CampaignRepository campaignRepository;
    private final DonationRepository donationRepository;

    public UserDashboardSummaryResponse getSummary(Long userId) {
        return UserDashboardSummaryResponse.builder()
            .totalCampaignsCreated(0)
            .activeCampaigns(0)
            .totalRaisedAcrossCampaigns(BigDecimal.ZERO)
            .totalDonationsMade(0)
            .totalAmountDonated(BigDecimal.ZERO)
            .bookmarkCount(0)
            .unreadNotifications(0)
            .recentBadges(Collections.emptyList())
            .build();
    }
}
