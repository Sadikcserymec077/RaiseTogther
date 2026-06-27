package com.crowdcash.controller;

import com.crowdcash.dto.ApiResponse;
import com.crowdcash.dto.ChangePasswordRequest;
import com.crowdcash.dto.UpdateProfileRequest;
import com.crowdcash.dto.UserProfileResponse;
import com.crowdcash.service.AuthService;
import com.crowdcash.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getMyProfile(Principal principal) {
        UserProfileResponse response = userService.getMyProfile(principal.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile fetched successfully", response));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @RequestBody UpdateProfileRequest request, Principal principal) {
        UserProfileResponse response = userService.updateProfile(principal.getName(), request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully", response));
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request, Principal principal) {
        authService.changePassword(principal.getName(), request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Password changed successfully", null));
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<ApiResponse<String>> uploadAvatar(
            @RequestParam("file") MultipartFile file, Principal principal) {
        String filePath = userService.uploadAvatar(principal.getName(), file);
        return ResponseEntity.ok(new ApiResponse<>(true, "Avatar uploaded successfully", filePath));
    }
}
