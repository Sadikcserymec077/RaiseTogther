package com.crowdcash.controller;

import com.crowdcash.dto.ApiResponse;
import com.crowdcash.dto.NotificationResponse;
import com.crowdcash.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private com.crowdcash.repository.UserRepository userRepository;

    private Long getUserId(Principal principal) {
        if (principal == null) return null;
        return userRepository.findByEmail(principal.getName()).map(u -> u.getId()).orElse(null);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<NotificationResponse>>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Principal principal) {
        Long userId = getUserId(principal);
        Page<NotificationResponse> result = notificationService.getNotifications(userId, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched successfully", result));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(Principal principal) {
        Long userId = getUserId(principal);
        return ResponseEntity.ok(ApiResponse.success("Unread count fetched", notificationService.getUnreadCount(userId)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id, Principal principal) {
        Long userId = getUserId(principal);
        notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(Principal principal) {
        Long userId = getUserId(principal);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Long id, Principal principal) {
        Long userId = getUserId(principal);
        notificationService.deleteNotification(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Notification deleted", null));
    }
}
