package com.crowdcash.controller;

import com.crowdcash.dto.ApiResponse;
import com.crowdcash.dto.CampaignSummaryResponse;
import com.crowdcash.service.BookmarkService;
import com.crowdcash.service.CampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/bookmarks")
@PreAuthorize("isAuthenticated()")
public class BookmarkController {

    @Autowired private BookmarkService bookmarkService;
    @Autowired private CampaignService campaignService;
    @Autowired private com.crowdcash.repository.UserRepository userRepository;

    private Long getUserId(Principal principal) {
        return userRepository.findByEmail(principal.getName()).map(u -> u.getId()).orElse(null);
    }

    @PostMapping("/{campaignId}")
    public ResponseEntity<ApiResponse<Void>> addBookmark(@PathVariable Long campaignId, Principal principal) {
        bookmarkService.addBookmark(getUserId(principal), campaignId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bookmarked successfully", null));
    }

    @DeleteMapping("/{campaignId}")
    public ResponseEntity<ApiResponse<Void>> removeBookmark(@PathVariable Long campaignId, Principal principal) {
        bookmarkService.removeBookmark(getUserId(principal), campaignId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bookmark removed", null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CampaignSummaryResponse>>> getBookmarks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Principal principal) {
        Long userId = getUserId(principal);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<CampaignSummaryResponse> bookmarks = bookmarkService.getBookmarkedCampaigns(userId, pageable)
                .map(campaignService::toSummary);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bookmarks fetched", bookmarks));
    }

    @GetMapping("/{campaignId}/status")
    public ResponseEntity<ApiResponse<Boolean>> checkBookmark(@PathVariable Long campaignId, Principal principal) {
        boolean status = bookmarkService.isBookmarked(getUserId(principal), campaignId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bookmark status", status));
    }
}
