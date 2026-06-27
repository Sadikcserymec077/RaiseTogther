package com.crowdcash.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionResponse {
    private Long id;
    private String content;
    private UserSummaryResponse askedBy;
    private Boolean isAnswered;
    private AnswerResponse answer;
    private LocalDateTime createdAt;
}
