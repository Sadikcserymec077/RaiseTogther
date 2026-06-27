package com.crowdcash.service;

import com.crowdcash.dto.*;
import com.crowdcash.exception.*;
import com.crowdcash.model.RefreshToken;
import com.crowdcash.model.Role;
import com.crowdcash.model.User;
import com.crowdcash.repository.RefreshTokenRepository;
import com.crowdcash.repository.RoleRepository;
import com.crowdcash.repository.UserRepository;
import com.crowdcash.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    @Value("${jwt.refresh-expiry-ms}")
    private Long refreshTokenDurationMs;

    @Transactional
    public void registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new EmailAlreadyExistsException("Error: Email is already in use!");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(encoder.encode(registerRequest.getPassword()));
        user.setPhone(registerRequest.getPhone());

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName("ROLE_USER");
                    return roleRepository.save(role);
                });

        user.getRoles().add(userRole);
        user = userRepository.save(user);

        // Generate a real token using JWT based on email
        String token = jwtUtil.generateTokenFromUsername(user.getEmail());
        emailService.sendVerificationEmail(user, token);

        // Create notification
        try {
            notificationService.createNotification(
                    user.getId(),
                    com.crowdcash.model.enums.NotificationType.REGISTRATION_SUCCESS,
                    "Welcome to CrowdCash+!",
                    "Thank you for registering. Please verify your email using the link sent to your inbox.",
                    null,
                    null
            );
        } catch (Exception e) {
            System.err.println("Could not create registration notification: " + e.getMessage());
        }
    }

    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Block login if email not verified
        if (!user.isEmailVerified()) {
            throw new BadRequestException("Email not verified. Please check your inbox and verify your email before logging in.");
        }

        String jwt = jwtUtil.generateJwtToken(authentication);
        RefreshToken refreshToken = createRefreshToken(user.getId());

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        return LoginResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken.getToken())
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .roles(roles)
                .build();
    }

    public RefreshToken createRefreshToken(Long userId) {
        RefreshToken refreshToken = new RefreshToken();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Remove existing token if any
        refreshTokenRepository.deleteByUser(user);

        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenExpiredException(token.getToken() + " Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Transactional
    public LoginResponse refreshToken(RefreshTokenRequest request) {
        return refreshTokenRepository.findByToken(request.getRefreshToken())
                .map(this::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtUtil.generateTokenFromUsername(user.getEmail());
                    return LoginResponse.builder()
                            .accessToken(token)
                            .refreshToken(request.getRefreshToken())
                            .userId(user.getId())
                            .name(user.getName())
                            .email(user.getEmail())
                            .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toList()))
                            .build();
                })
                .orElseThrow(() -> new TokenExpiredException("Refresh token is not in database!"));
    }
    
    @Transactional
    public void logout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        refreshTokenRepository.deleteByUser(user);
    }
    
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String token = jwtUtil.generateTokenFromUsername(user.getEmail());
        emailService.sendPasswordResetEmail(user, token);
    }
    
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
        
        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
        
        if (!jwtUtil.validateJwtToken(request.getToken())) {
            throw new BadRequestException("Invalid or expired reset token");
        }
        
        String email = jwtUtil.getUserNameFromJwtToken(request.getToken());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void verifyEmail(String token) {
        if (!jwtUtil.validateJwtToken(token)) {
            throw new BadRequestException("Invalid or expired verification token");
        }
        
        String email = jwtUtil.getUserNameFromJwtToken(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        user.setEmailVerified(true);
        user = userRepository.save(user);

        // Create notification
        try {
            notificationService.createNotification(
                    user.getId(),
                    com.crowdcash.model.enums.NotificationType.EMAIL_VERIFIED,
                    "Email Verified Successfully!",
                    "Your email has been verified. You can now explore and support campaigns.",
                    null,
                    null
            );
        } catch (Exception e) {
            System.err.println("Could not create email verification notification: " + e.getMessage());
        }
    }
}
