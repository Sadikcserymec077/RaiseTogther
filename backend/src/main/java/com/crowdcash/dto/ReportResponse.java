package com.crowdcash.dto;

import com.crowdcash.model.enums.ReportReason;
import com.crowdcash.model.enums.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportResponse {
    private Long id;
    private CampaignSummaryResponse campaign;
    private UserSummaryResponse reporter;
    private ReportReason reason;
    private String description;
    private ReportStatus status;
    private String adminNotes;
    private UserSummaryResponse reviewedBy;
    private LocalDateTime createdAt;
}
