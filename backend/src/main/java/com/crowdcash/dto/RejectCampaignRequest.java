package com.crowdcash.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejectCampaignRequest {
    @NotBlank(message = "Admin remarks are required")
    private String adminRemarks;
    private boolean requestMoreDocuments;
}
