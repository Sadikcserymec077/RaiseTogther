package com.crowdcash.dto;

import com.crowdcash.model.enums.CampaignCategory;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateCampaignRequest {
    private String title;
    private String description;
    private String story;
    private BigDecimal goalAmount;
    private CampaignCategory category;
    private String location;
    private LocalDate deadline;
}
