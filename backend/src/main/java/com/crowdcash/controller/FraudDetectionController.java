package com.crowdcash.controller;

import com.crowdcash.service.FraudDetectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Collections;

@RestController
@RequestMapping("/api/v1/admin/fraud")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class FraudDetectionController {
    private final FraudDetectionService fraudDetectionService;

    @GetMapping("/suspicious-donations")
    public ResponseEntity<List<Object>> getSuspiciousDonations() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/reported-campaigns")
    public ResponseEntity<List<Object>> getReportedCampaigns() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/high-risk-transactions")
    public ResponseEntity<List<Object>> getHighRiskTransactions() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @PutMapping("/campaigns/{id}/suspend")
    public ResponseEntity<String> suspendCampaign(@PathVariable Long id) {
        return ResponseEntity.ok("Campaign suspended");
    }
}
