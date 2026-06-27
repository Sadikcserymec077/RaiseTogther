package com.crowdcash.controller;

import com.crowdcash.dto.BadgeResponse;
import com.crowdcash.model.Badge;
import com.crowdcash.repository.BadgeRepository;
import com.crowdcash.repository.UserBadgeRepository;
import com.crowdcash.repository.UserRepository;
import com.crowdcash.model.User;
import org.springframework.security.core.userdetails.UserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/badges")
@RequiredArgsConstructor
public class BadgeController {

    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final UserRepository userRepository;

    @GetMapping("/")
    public ResponseEntity<List<BadgeResponse>> getAllBadges() {
        return ResponseEntity.ok(badgeRepository.findAll().stream().map(b -> 
            BadgeResponse.builder()
                .id(b.getId())
                .name(b.getName())
                .description(b.getDescription())
                .iconUrl(b.getIconUrl())
                .type(b.getType().name())
                .earned(false)
                .build()
        ).collect(Collectors.toList()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BadgeResponse>> getUserBadges(@PathVariable Long userId) {
        return ResponseEntity.ok(userBadgeRepository.findByUserId(userId).stream().map(ub -> 
            BadgeResponse.builder()
                .id(ub.getBadge().getId())
                .name(ub.getBadge().getName())
                .description(ub.getBadge().getDescription())
                .iconUrl(ub.getBadge().getIconUrl())
                .type(ub.getBadge().getType().name())
                .awardedAt(ub.getAwardedAt().toString())
                .earned(true)
                .build()
        ).collect(Collectors.toList()));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<BadgeResponse>> getMyBadges(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return getUserBadges(user.getId());
    }
}
