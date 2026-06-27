package com.crowdcash.dto;

import com.crowdcash.model.enums.CampaignCategory;
import com.crowdcash.model.enums.CampaignStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class CampaignSummaryResponse {
    private Long id;
    private String title;
    private String thumbnailImage;
    private CampaignCategory category;
    private CampaignStatus status;
    private BigDecimal goalAmount;
    private BigDecimal raisedAmount;
    private double progressPercent;
    private Integer donorCount;
    private int daysRemaining;
    private String location;
    private String creatorName;
    private String creatorAvatar;
    private Long creatorId;
    private Boolean isFeatured;
}
