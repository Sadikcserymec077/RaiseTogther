package com.crowdcash.controller;

import com.crowdcash.dto.ApiResponse;
import com.crowdcash.dto.CreateRewardRequest;
import com.crowdcash.dto.RewardResponse;
import com.crowdcash.service.RewardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/rewards")
public class RewardController {

    @Autowired private RewardService rewardService;
    @Autowired private com.crowdcash.repository.UserRepository userRepository;

    private Long getUserId(Principal principal) {
        return userRepository.findByEmail(principal.getName()).map(u -> u.getId()).orElse(null);
    }

    @PostMapping("/campaign/{campaignId}")
    public ResponseEntity<ApiResponse<RewardResponse>> create(
            @PathVariable Long campaignId, @RequestBody CreateRewardRequest req, Principal principal) {
        return ResponseEntity.ok(ApiResponse.success("Reward created", rewardService.createReward(campaignId, req, getUserId(principal))));
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<ApiResponse<List<RewardResponse>>> listByCampaign(@PathVariable Long campaignId) {
        return ResponseEntity.ok(ApiResponse.success("Rewards", rewardService.getRewardsForCampaign(campaignId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RewardResponse>> update(
            @PathVariable Long id, @RequestBody CreateRewardRequest req, Principal principal) {
        return ResponseEntity.ok(ApiResponse.success("Reward updated", rewardService.updateReward(id, req, getUserId(principal))));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Long id, Principal principal) {
        rewardService.deleteReward(id, getUserId(principal));
        return ResponseEntity.ok(ApiResponse.success("Reward deleted", null));
    }
}
