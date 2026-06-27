package com.crowdcash.service;

import com.crowdcash.dto.UpdateProfileRequest;
import com.crowdcash.dto.UserProfileResponse;
import com.crowdcash.exception.ResourceNotFoundException;
import com.crowdcash.model.Role;
import com.crowdcash.model.User;
import com.crowdcash.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public UserProfileResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserProfileResponse(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getAddress() != null) user.setAddress(request.getAddress());

        userRepository.save(user);
        return mapToUserProfileResponse(user);
    }

    @Transactional
    public String uploadAvatar(String email, MultipartFile file) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        String filePath = fileStorageService.storeFile(file);
        user.setProfilePicture(filePath);
        userRepository.save(user);
        
        return filePath;
    }

    private UserProfileResponse mapToUserProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .profilePicture(user.getProfilePicture())
                .bio(user.getBio())
                .address(user.getAddress())
                .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toList()))
                .isEmailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .totalCampaigns(0)
                .totalDonations(0)
                .badges(java.util.List.of())
                .build();
    }
}
