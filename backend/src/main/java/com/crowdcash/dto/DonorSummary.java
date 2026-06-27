package com.crowdcash.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonorSummary {
    private String displayName; // "Anonymous" if anonymous
    private BigDecimal amount;
    private String message;
    private String avatarUrl;
    private LocalDateTime createdAt;
}
