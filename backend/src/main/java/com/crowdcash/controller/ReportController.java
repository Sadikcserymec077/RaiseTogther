package com.crowdcash.controller;

import com.crowdcash.dto.ApiResponse;
import com.crowdcash.dto.CreateReportRequest;
import com.crowdcash.dto.ReportResponse;
import com.crowdcash.model.enums.ReportStatus;
import com.crowdcash.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private com.crowdcash.repository.UserRepository userRepository;

    private Long getUserId(Principal principal) {
        if (principal == null) return null;
        return userRepository.findByEmail(principal.getName()).map(u -> u.getId()).orElse(null);
    }

    @PostMapping("/campaign/{campaignId}")
    public ResponseEntity<ApiResponse<ReportResponse>> reportCampaign(
            @PathVariable Long campaignId,
            @RequestBody CreateReportRequest request,
            Principal principal) {
        Long userId = getUserId(principal);
        ReportResponse response = reportService.reportCampaign(campaignId, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Campaign reported successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ReportResponse>>> getReports(
            @RequestParam(required = false) ReportStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReportResponse> result = reportService.getReports(status, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success("Reports fetched successfully", result));
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<ApiResponse<ReportResponse>> reviewReport(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "") String notes,
            Principal principal) {
        Long adminUserId = getUserId(principal);
        ReportResponse response = reportService.reviewReport(id, notes, adminUserId);
        return ResponseEntity.ok(ApiResponse.success("Report reviewed", response));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<ReportResponse>> resolveReport(
            @PathVariable Long id,
            Principal principal) {
        Long adminUserId = getUserId(principal);
        ReportResponse response = reportService.resolveReport(id, adminUserId);
        return ResponseEntity.ok(ApiResponse.success("Report resolved", response));
    }

    @PutMapping("/{id}/dismiss")
    public ResponseEntity<ApiResponse<ReportResponse>> dismissReport(
            @PathVariable Long id,
            Principal principal) {
        Long adminUserId = getUserId(principal);
        ReportResponse response = reportService.dismissReport(id, adminUserId);
        return ResponseEntity.ok(ApiResponse.success("Report dismissed", response));
    }
}
