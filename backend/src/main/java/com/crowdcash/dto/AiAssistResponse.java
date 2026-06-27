package com.crowdcash.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class AiAssistResponse {
    private String suggestedTitle;
    private String improvedDescription;
    private String improvedStory;
    private BigDecimal suggestedGoal;
    private List<String> fundraisingTips;
    private List<String> missingFields;
    private String generalAdvice;
}
