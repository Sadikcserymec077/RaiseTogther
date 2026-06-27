package com.crowdcash.service;

import com.crowdcash.dto.TopCampaignResponse;
import com.crowdcash.dto.TopCreatorResponse;
import com.crowdcash.dto.TopDonorResponse;
import com.crowdcash.model.Campaign;
import com.crowdcash.model.User;
import com.crowdcash.repository.CampaignRepository;
import com.crowdcash.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class LeaderboardService {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    public List<TopDonorResponse> getTopDonors(String period) {
        List<Object[]> queryResult;
        if ("monthly".equalsIgnoreCase(period)) {
            LocalDateTime startOfMonth = LocalDateTime.now().with(TemporalAdjusters.firstDayOfMonth()).withHour(0).withMinute(0).withSecond(0).withNano(0);
            queryResult = donationRepository.findTopDonorsMonthly(startOfMonth, PageRequest.of(0, 10));
        } else {
            queryResult = donationRepository.findTopDonorsAllTime(PageRequest.of(0, 10));
        }

        List<TopDonorResponse> responses = new ArrayList<>();
        int rank = 1;
        for (Object[] row : queryResult) {
            User user = (User) row[0];
            BigDecimal totalDonated = (BigDecimal) row[1];
            long count = (long) row[2];

            responses.add(TopDonorResponse.builder()
                    .rank(rank++)
                    .userId(user.getId())
                    .displayName(user.getName())
                    .avatarUrl(user.getProfilePicture())
                    .totalDonated(totalDonated)
                    .donationCount(count)
                    .badge(getBadgeForRank(rank - 1))
                    .build());
        }
        return responses;
    }

    public List<TopCampaignResponse> getTopCampaigns() {
        List<Campaign> campaigns = campaignRepository.findTopCampaigns(PageRequest.of(0, 10));
        List<TopCampaignResponse> responses = new ArrayList<>();
        int rank = 1;
        for (Campaign c : campaigns) {
            responses.add(TopCampaignResponse.builder()
                    .rank(rank++)
                    .campaignId(c.getId())
                    .title(c.getTitle())
                    .thumbnailImage(c.getThumbnailImage())
                    .raisedAmount(c.getRaisedAmount())
                    .donorCount(c.getDonorCount())
                    .creatorName(c.getCreator().getName())
                    .build());
        }
        return responses;
    }

    public List<TopCreatorResponse> getTopCreators() {
        List<Object[]> queryResult = campaignRepository.findTopCreators(PageRequest.of(0, 10));
        List<TopCreatorResponse> responses = new ArrayList<>();
        int rank = 1;
        for (Object[] row : queryResult) {
            User user = (User) row[0];
            BigDecimal totalRaised = (BigDecimal) row[1];
            long count = (long) row[2];

            responses.add(TopCreatorResponse.builder()
                    .rank(rank++)
                    .userId(user.getId())
                    .name(user.getName())
                    .avatarUrl(user.getProfilePicture())
                    .totalRaised(totalRaised)
                    .campaignCount(count)
                    .build());
        }
        return responses;
    }

    private String getBadgeForRank(int rank) {
        if (rank == 1) return "Gold Philanthropist";
        if (rank == 2) return "Silver Philanthropist";
        if (rank == 3) return "Bronze Philanthropist";
        return "Supporter";
    }
}
