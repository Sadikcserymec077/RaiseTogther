package com.crowdcash.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopCreatorResponse {
    private int rank;
    private Long userId;
    private String name;
    private String avatarUrl;
    private BigDecimal totalRaised;
    private long campaignCount;
}
