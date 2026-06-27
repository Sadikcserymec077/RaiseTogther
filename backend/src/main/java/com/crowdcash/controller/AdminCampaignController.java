package com.crowdcash.controller;

import com.crowdcash.dto.*;
import com.crowdcash.service.CampaignService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/admin/campaigns")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCampaignController {

    @Autowired private CampaignService campaignService;
    @Autowired private com.crowdcash.repository.UserRepository userRepository;

    private Long getUserId(Principal principal) {
        return userRepository.findByEmail(principal.getName()).map(u -> u.getId()).orElse(null);
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<Page<CampaignSummaryResponse>>> getPending(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        return ResponseEntity.ok(new ApiResponse<>(true, "Pending campaigns", campaignService.getPendingCampaigns(pageable)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CampaignSummaryResponse>>> getAllCampaigns(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(new ApiResponse<>(true, "All campaigns", campaignService.getAllCampaigns(pageable)));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<CampaignResponse>> approve(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Campaign approved", campaignService.approveCampaign(id, getUserId(principal))));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<CampaignResponse>> reject(
            @PathVariable Long id, @Valid @RequestBody RejectCampaignRequest req, Principal principal) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Campaign rejected", campaignService.rejectCampaign(id, req, getUserId(principal))));
    }

    @PutMapping("/{id}/feature")
    public ResponseEntity<ApiResponse<Void>> feature(@PathVariable Long id) {
        campaignService.toggleFeatured(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Featured status toggled", null));
    }

    @PutMapping("/{id}/expire")
    public ResponseEntity<ApiResponse<Void>> expire(@PathVariable Long id) {
        campaignService.expireCampaign(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Campaign expired", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> forceDelete(@PathVariable Long id) {
        campaignService.forceDelete(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Campaign deleted", null));
    }
}
