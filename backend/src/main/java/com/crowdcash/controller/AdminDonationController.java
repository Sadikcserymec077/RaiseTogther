package com.crowdcash.controller;

import com.crowdcash.dto.DonationResponse;
import com.crowdcash.dto.ApiResponse;
import com.crowdcash.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/donations")
public class AdminDonationController {

    @Autowired private DonationService donationService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<DonationResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success("All donations",
                donationService.getAllDonations(PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }

    @PutMapping("/{id}/refund")
    public ResponseEntity<ApiResponse<String>> refund(@PathVariable Long id) {
        donationService.refundDonation(id);
        return ResponseEntity.ok(ApiResponse.success("Donation marked as refunded", null));
    }
}
