package com.crowdcash.controller;

import com.crowdcash.dto.UserDashboardSummaryResponse;
import com.crowdcash.service.UserDashboardService;
import com.crowdcash.repository.UserRepository;
import com.crowdcash.model.User;
import org.springframework.security.core.userdetails.UserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserDashboardController {
    private final UserDashboardService userDashboardService;
    private final UserRepository userRepository;

    @GetMapping("/summary")
    public ResponseEntity<UserDashboardSummaryResponse> getSummary(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(userDashboardService.getSummary(user.getId()));
    }
}
