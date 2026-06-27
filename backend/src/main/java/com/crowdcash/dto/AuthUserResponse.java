package com.crowdcash.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class AuthUserResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String profilePicture;
    private List<String> roles;
    private boolean isEmailVerified;
}
