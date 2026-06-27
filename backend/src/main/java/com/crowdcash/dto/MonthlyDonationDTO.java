package com.crowdcash.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class MonthlyDonationDTO {
    private String month;
    private BigDecimal amount;
    private long count;
}
