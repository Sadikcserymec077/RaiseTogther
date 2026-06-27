package com.crowdcash.repository;

import com.crowdcash.model.Reward;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RewardRepository extends JpaRepository<Reward, Long> {
    List<Reward> findByCampaignIdOrderByMinimumAmountAsc(Long campaignId);
}
