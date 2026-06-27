package com.crowdcash.service;

import com.crowdcash.dto.CreateRewardRequest;
import com.crowdcash.dto.RewardResponse;
import com.crowdcash.exception.ResourceNotFoundException;
import com.crowdcash.exception.UnauthorizedException;
import com.crowdcash.model.Campaign;
import com.crowdcash.model.Donation;
import com.crowdcash.model.Reward;
import com.crowdcash.repository.CampaignRepository;
import com.crowdcash.repository.RewardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RewardService {

    @Autowired private RewardRepository rewardRepository;
    @Autowired private CampaignRepository campaignRepository;

    @Transactional
    public RewardResponse createReward(Long campaignId, CreateRewardRequest req, Long userId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
        if (!campaign.getCreator().getId().equals(userId))
            throw new UnauthorizedException("You are not the owner of this campaign");

        Reward reward = Reward.builder()
                .campaign(campaign)
                .title(req.getTitle())
                .description(req.getDescription())
                .minimumAmount(req.getMinimumAmount())
                .maxClaims(req.getMaxClaims())
                .imageUrl(req.getImageUrl())
                .build();
        return toResponse(rewardRepository.save(reward));
    }

    public List<RewardResponse> getRewardsForCampaign(Long campaignId) {
        return rewardRepository.findByCampaignIdOrderByMinimumAmountAsc(campaignId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public RewardResponse updateReward(Long id, CreateRewardRequest req, Long userId) {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reward not found"));
        if (!reward.getCampaign().getCreator().getId().equals(userId))
            throw new UnauthorizedException("You are not the owner of this reward");

        if (req.getTitle() != null) reward.setTitle(req.getTitle());
        if (req.getDescription() != null) reward.setDescription(req.getDescription());
        if (req.getMinimumAmount() != null) reward.setMinimumAmount(req.getMinimumAmount());
        if (req.getMaxClaims() != null) reward.setMaxClaims(req.getMaxClaims());
        if (req.getImageUrl() != null) reward.setImageUrl(req.getImageUrl());
        return toResponse(rewardRepository.save(reward));
    }

    @Transactional
    public void deleteReward(Long id, Long userId) {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reward not found"));
        if (!reward.getCampaign().getCreator().getId().equals(userId))
            throw new UnauthorizedException("You are not the owner of this reward");
        rewardRepository.delete(reward);
    }

    @Transactional
    public Reward assignReward(Donation donation) {
        List<Reward> rewards = rewardRepository
                .findByCampaignIdOrderByMinimumAmountAsc(donation.getCampaign().getId());

        // Find the best matching reward (highest minimum that is <= donation amount)
        Reward best = null;
        for (Reward r : rewards) {
            if (donation.getAmount().compareTo(r.getMinimumAmount()) >= 0) {
                if (r.getMaxClaims() == null || r.getTotalClaimed() < r.getMaxClaims()) {
                    best = r;
                }
            }
        }
        if (best != null) {
            best.setTotalClaimed(best.getTotalClaimed() + 1);
            rewardRepository.save(best);
        }
        return best;
    }

    public RewardResponse toResponse(Reward r) {
        boolean available = r.getMaxClaims() == null || r.getTotalClaimed() < r.getMaxClaims();
        return RewardResponse.builder()
                .id(r.getId())
                .title(r.getTitle())
                .description(r.getDescription())
                .minimumAmount(r.getMinimumAmount())
                .imageUrl(r.getImageUrl())
                .totalClaimed(r.getTotalClaimed())
                .maxClaims(r.getMaxClaims())
                .isAvailable(available)
                .build();
    }
}
