package com.crowdcash.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String profilePicture;
    private String bio;
    private String address;
    private List<String> roles;
    private boolean isEmailVerified;
    private LocalDateTime createdAt;
    // Placeholders for future modules
    private int totalCampaigns;
    private int totalDonations;
    private List<String> badges;
}
