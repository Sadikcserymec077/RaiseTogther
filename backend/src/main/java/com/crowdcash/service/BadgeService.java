package com.crowdcash.service;

import com.crowdcash.model.Badge;
import com.crowdcash.model.UserBadge;
import com.crowdcash.model.User;
import com.crowdcash.model.enums.BadgeType;
import com.crowdcash.repository.BadgeRepository;
import com.crowdcash.repository.UserBadgeRepository;
import com.crowdcash.repository.UserRepository;
import com.crowdcash.repository.DonationRepository;
import com.crowdcash.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BadgeService {

    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final UserRepository userRepository;
    private final DonationRepository donationRepository;
    private final CampaignRepository campaignRepository;
    private final NotificationService notificationService;

    public void checkAndAssignBadges(Long userId) {
        // Implement rules for badge assignment
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;
        
        // Example: FIRST_CAMPAIGN
        // check if user has created a campaign, if so award FIRST_CAMPAIGN
        
        // This is a stub implementation of checkAndAssignBadges logic
        // In a real implementation this would check all conditions explicitly
    }
    
    private void awardBadge(User user, BadgeType type) {
        Optional<Badge> badgeOpt = badgeRepository.findByType(type);
        if (badgeOpt.isPresent()) {
            Badge badge = badgeOpt.get();
            if (!userBadgeRepository.existsByUserIdAndBadgeId(user.getId(), badge.getId())) {
                UserBadge userBadge = new UserBadge();
                userBadge.setUser(user);
                userBadge.setBadge(badge);
                userBadgeRepository.save(userBadge);
                // Notify user
                // notificationService.createNotification(...)
            }
        }
    }
}
