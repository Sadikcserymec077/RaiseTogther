package com.crowdcash.service;

import com.crowdcash.dto.OverviewResponse;
import com.crowdcash.dto.MonthlyDonationDTO;
import com.crowdcash.dto.CategoryStatsDTO;
import com.crowdcash.repository.UserRepository;
import com.crowdcash.repository.CampaignRepository;
import com.crowdcash.repository.DonationRepository;
import com.crowdcash.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final UserRepository userRepository;
    private final CampaignRepository campaignRepository;
    private final DonationRepository donationRepository;
    private final ReportRepository reportRepository;

    public OverviewResponse getOverview() {
        return OverviewResponse.builder()
            .totalUsers(userRepository.count())
            .totalCampaigns(campaignRepository.count())
            .totalDonationsAmount(BigDecimal.ZERO) // compute properly
            .totalDonationCount(donationRepository.count())
            .totalReports(reportRepository.count())
            .build();
    }

    public List<MonthlyDonationDTO> getMonthlyDonations() {
        return Collections.emptyList(); // stub
    }

    public List<CategoryStatsDTO> getCampaignsByCategory() {
        return Collections.emptyList(); // stub
    }

    public Map<String, Long> getCampaignStatus() {
        return Collections.emptyMap(); // stub
    }
}
