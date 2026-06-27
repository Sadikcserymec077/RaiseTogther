package com.crowdcash.repository;

import com.crowdcash.model.CampaignImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignImageRepository extends JpaRepository<CampaignImage, Long> {
    List<CampaignImage> findByCampaignIdOrderByDisplayOrderAsc(Long campaignId);
}
