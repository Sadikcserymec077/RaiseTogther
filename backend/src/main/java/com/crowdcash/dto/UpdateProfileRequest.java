package com.crowdcash.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String name;
    private String phone;
    private String bio;
    private String address;
}
