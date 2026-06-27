package com.crowdcash.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AiAssistRequest {
    private String title;
    private String description;
    private String category;
    private String location;
    private BigDecimal currentGoal;
    private String story;
}
