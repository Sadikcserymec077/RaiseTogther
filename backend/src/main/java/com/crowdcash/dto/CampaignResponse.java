package com.crowdcash.dto;

import com.crowdcash.model.enums.CampaignCategory;
import com.crowdcash.model.enums.CampaignStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CampaignResponse {
    private Long id;
    private String title;
    private String description;
    private String story;
    private BigDecimal goalAmount;
    private BigDecimal raisedAmount;
    private double progressPercent;
    private CampaignCategory category;
    private CampaignStatus status;
    private String location;
    private LocalDate deadline;
    private int daysRemaining;
    private String thumbnailImage;
    private List<String> images;
    private Integer donorCount;
    private Integer viewCount;
    private Boolean isFeatured;
    private boolean isBookmarked;
    private UserSummaryResponse creator;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
