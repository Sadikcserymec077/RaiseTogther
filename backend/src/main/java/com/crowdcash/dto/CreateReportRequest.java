package com.crowdcash.dto;

import com.crowdcash.model.enums.ReportReason;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateReportRequest {
    private ReportReason reason;
    private String description;
}
