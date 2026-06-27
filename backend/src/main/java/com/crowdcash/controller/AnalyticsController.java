package com.crowdcash.controller;

import com.crowdcash.dto.OverviewResponse;
import com.crowdcash.dto.MonthlyDonationDTO;
import com.crowdcash.dto.CategoryStatsDTO;
import com.crowdcash.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @GetMapping("/overview")
    public ResponseEntity<OverviewResponse> getOverview() {
        return ResponseEntity.ok(analyticsService.getOverview());
    }

    @GetMapping("/donations/monthly")
    public ResponseEntity<List<MonthlyDonationDTO>> getMonthlyDonations() {
        return ResponseEntity.ok(analyticsService.getMonthlyDonations());
    }

    @GetMapping("/campaigns/by-category")
    public ResponseEntity<List<CategoryStatsDTO>> getCampaignsByCategory() {
        return ResponseEntity.ok(analyticsService.getCampaignsByCategory());
    }

    @GetMapping("/campaigns/status")
    public ResponseEntity<Map<String, Long>> getCampaignStatus() {
        return ResponseEntity.ok(analyticsService.getCampaignStatus());
    }
}
