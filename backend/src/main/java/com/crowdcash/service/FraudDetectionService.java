package com.crowdcash.service;

import com.crowdcash.repository.DonationRepository;
import com.crowdcash.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;

@Service
@RequiredArgsConstructor
public class FraudDetectionService {
    private final DonationRepository donationRepository;
    private final CampaignRepository campaignRepository;

    @Scheduled(fixedRate = 3600000)
    public void runFraudChecks() {
        // Find high-risk donations, duplicate users, etc.
    }
}
