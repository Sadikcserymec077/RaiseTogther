package com.crowdcash.controller;

import com.crowdcash.dto.ApiResponse;
import com.crowdcash.dto.TopCampaignResponse;
import com.crowdcash.dto.TopCreatorResponse;
import com.crowdcash.dto.TopDonorResponse;
import com.crowdcash.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/v1/leaderboard")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/top-donors")
    public ResponseEntity<ApiResponse<List<TopDonorResponse>>> getTopDonors(@RequestParam(defaultValue = "all") String period) {
        List<TopDonorResponse> result = leaderboardService.getTopDonors(period);
        return ResponseEntity.ok(ApiResponse.success("Top donors fetched successfully", result));
    }

    @GetMapping("/top-campaigns")
    public ResponseEntity<ApiResponse<List<TopCampaignResponse>>> getTopCampaigns() {
        List<TopCampaignResponse> result = leaderboardService.getTopCampaigns();
        return ResponseEntity.ok(ApiResponse.success("Top campaigns fetched successfully", result));
    }

    @GetMapping("/top-creators")
    public ResponseEntity<ApiResponse<List<TopCreatorResponse>>> getTopCreators() {
        List<TopCreatorResponse> result = leaderboardService.getTopCreators();
        return ResponseEntity.ok(ApiResponse.success("Top creators fetched successfully", result));
    }
}
