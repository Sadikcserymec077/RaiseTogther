package com.crowdcash.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BadgeResponse {
    private Long id;
    private String name;
    private String description;
    private String iconUrl;
    private String type;
    private String awardedAt;
    private boolean earned;
}
