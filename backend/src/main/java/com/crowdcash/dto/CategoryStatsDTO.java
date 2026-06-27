package com.crowdcash.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CategoryStatsDTO {
    private String category;
    private long campaignCount;
    private BigDecimal totalRaised;
    private long donorCount;
}
