package com.crowdcash.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CampaignUpdateRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;
}
