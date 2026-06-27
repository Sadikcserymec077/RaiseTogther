package com.crowdcash.dto;

import com.crowdcash.model.enums.CampaignCategory;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateCampaignRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be under 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String story;

    @NotNull(message = "Goal amount is required")
    @DecimalMin(value = "1000.00", message = "Goal must be at least ₹1000")
    private BigDecimal goalAmount;

    @NotNull(message = "Category is required")
    private CampaignCategory category;

    private String location;

    @NotNull(message = "Deadline is required")
    @Future(message = "Deadline must be a future date")
    private LocalDate deadline;
}
