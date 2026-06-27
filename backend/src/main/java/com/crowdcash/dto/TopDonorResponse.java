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
public class TopDonorResponse {
    private int rank;
    private Long userId;
    private String displayName;
    private String avatarUrl;
    private BigDecimal totalDonated;
    private long donationCount;
    private String badge;
}
