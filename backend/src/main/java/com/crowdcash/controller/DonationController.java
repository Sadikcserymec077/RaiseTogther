package com.crowdcash.controller;

import com.crowdcash.dto.*;
import com.crowdcash.security.JwtUtil;
import com.crowdcash.service.DonationService;
import com.crowdcash.service.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/donations")
public class DonationController {

    @Autowired private DonationService donationService;
    @Autowired private ReceiptService receiptService;
    @Autowired private com.crowdcash.repository.UserRepository userRepository;
    @Autowired private JwtUtil jwtUtil;

    private Long getUserId(Principal principal) {
        if (principal == null) return null;
        return userRepository.findByEmail(principal.getName()).map(u -> u.getId()).orElse(null);
    }

    @PostMapping("/initiate")
    public ResponseEntity<ApiResponse<InitiateDonationResponse>> initiate(
            @RequestBody InitiateDonationRequest req, Principal principal) {
        InitiateDonationResponse response = donationService.initiateDonation(req, getUserId(principal));
        return ResponseEntity.ok(ApiResponse.success("Donation order created", response));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<DonationSuccessResponse>> verify(@RequestBody VerifyPaymentRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", donationService.verifyPayment(req)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<DonationResponse>>> getHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Principal principal) {
        return ResponseEntity.ok(ApiResponse.success("Donation history",
                donationService.getDonationHistory(getUserId(principal), PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DonationResponse>> getById(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(ApiResponse.success("Donation details", donationService.getDonationById(id, getUserId(principal))));
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<ApiResponse<Page<DonorSummary>>> getCampaignDonations(
            @PathVariable Long campaignId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Campaign donations",
                donationService.getCampaignDonations(campaignId, PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }

    @GetMapping("/campaign/{campaignId}/stats")
    public ResponseEntity<ApiResponse<CampaignDonationStatsResponse>> getCampaignStats(@PathVariable Long campaignId) {
        return ResponseEntity.ok(ApiResponse.success("Campaign stats", donationService.getCampaignDonationStats(campaignId)));
    }

    @GetMapping("/{id}/receipt")
    public ResponseEntity<Resource> downloadReceipt(@PathVariable Long id, Principal principal,
            @RequestParam(required = false) String token) {
        // Support token as query param for direct browser downloads
        Long userId = getUserId(principal);
        if (userId == null && token != null) {
            try {
                String email = jwtUtil.getUserNameFromJwtToken(token);
                userId = userRepository.findByEmail(email).map(u -> u.getId()).orElse(null);
            } catch (Exception ignored) {}
        }
        Resource resource = receiptService.getReceiptPdf(id, userId);
        String filename = "donation-receipt-" + id + ".pdf";
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(resource);
    }

    @GetMapping("/{id}/receipt/email")
    public ResponseEntity<ApiResponse<String>> emailReceipt(@PathVariable Long id, Principal principal) {
        receiptService.emailReceipt(id, getUserId(principal));
        return ResponseEntity.ok(ApiResponse.success("Receipt emailed successfully", null));
    }
}
