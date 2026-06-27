package com.crowdcash.controller;

import com.crowdcash.dto.*;
import com.crowdcash.model.enums.CampaignCategory;
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
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/campaigns")
public class CampaignController {

    @Autowired private CampaignService campaignService;
    @Autowired private com.crowdcash.repository.UserRepository userRepository;

    private Long getUserId(Principal principal) {
        if (principal == null) return null;
        return userRepository.findByEmail(principal.getName())
                .map(u -> u.getId()).orElse(null);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CampaignSummaryResponse>>> getCampaigns(
            @RequestParam(required = false) CampaignCategory category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BigDecimal minGoal,
            @RequestParam(required = false) BigDecimal maxGoal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        String[] sortParts = sort.split(",");
        Sort.Direction dir = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortParts[0]));
        return ResponseEntity.ok(new ApiResponse<>(true, "Campaigns fetched", campaignService.getApprovedCampaigns(category, location, search, minGoal, maxGoal, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CampaignResponse>> getCampaign(@PathVariable Long id, Principal principal) {
        Long userId = getUserId(principal);
        return ResponseEntity.ok(new ApiResponse<>(true, "Campaign fetched", campaignService.getCampaignById(id, userId)));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<CampaignSummaryResponse>>> getFeatured() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Featured campaigns", campaignService.getFeaturedCampaigns()));
    }

    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<List<CampaignSummaryResponse>>> getTrending() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Trending campaigns", campaignService.getTrendingCampaigns()));
    }

    @GetMapping("/ending-soon")
    public ResponseEntity<ApiResponse<List<CampaignSummaryResponse>>> getEndingSoon() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Ending soon campaigns", campaignService.getEndingSoonCampaigns()));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<CampaignSummaryResponse>>> getMyCampaigns(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Principal principal) {
        Long userId = getUserId(principal);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(new ApiResponse<>(true, "My campaigns", campaignService.getMyCampaigns(userId, pageable)));
    }

    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CampaignResponse>> createCampaign(
            @RequestPart("campaign") @Valid CreateCampaignRequest req,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestPart(value = "identityDoc", required = false) MultipartFile identityDoc,
            Principal principal) {
        Long userId = getUserId(principal);
        return ResponseEntity.ok(new ApiResponse<>(true, "Campaign created successfully", campaignService.createCampaign(req, userId, thumbnail, identityDoc)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CampaignResponse>> updateCampaign(
            @PathVariable Long id, @RequestBody UpdateCampaignRequest req, Principal principal) {
        Long userId = getUserId(principal);
        return ResponseEntity.ok(new ApiResponse<>(true, "Campaign updated", campaignService.updateCampaign(id, req, userId)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteCampaign(@PathVariable Long id, Principal principal) {
        campaignService.deleteCampaign(id, getUserId(principal));
        return ResponseEntity.ok(new ApiResponse<>(true, "Campaign deleted", null));
    }

    @PutMapping("/{id}/pause")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> pauseCampaign(@PathVariable Long id, Principal principal) {
        campaignService.pauseCampaign(id, getUserId(principal));
        return ResponseEntity.ok(new ApiResponse<>(true, "Campaign paused", null));
    }

    @PutMapping("/{id}/resume")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> resumeCampaign(@PathVariable Long id, Principal principal) {
        campaignService.resumeCampaign(id, getUserId(principal));
        return ResponseEntity.ok(new ApiResponse<>(true, "Campaign resumed", null));
    }

    @PostMapping("/{id}/images")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<String>> addImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            Principal principal) {
        String url = campaignService.addCampaignImage(id, getUserId(principal), file);
        return ResponseEntity.ok(new ApiResponse<>(true, "Image uploaded", url));
    }

    @DeleteMapping("/{id}/images/{imageId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteImage(@PathVariable Long id, @PathVariable Long imageId, Principal principal) {
        campaignService.deleteCampaignImage(id, imageId, getUserId(principal));
        return ResponseEntity.ok(new ApiResponse<>(true, "Image deleted", null));
    }

    @PostMapping("/{id}/updates")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CampaignUpdateResponse>> postUpdate(
            @PathVariable Long id, @Valid @RequestBody CampaignUpdateRequest req, Principal principal) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Update posted", campaignService.postUpdate(id, req, getUserId(principal))));
    }

    @GetMapping("/{id}/updates")
    public ResponseEntity<ApiResponse<List<CampaignUpdateResponse>>> getUpdates(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Updates fetched", campaignService.getCampaignUpdates(id)));
    }
}
