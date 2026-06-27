package com.crowdcash.dto;

import com.crowdcash.model.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationMessage {
    private Long notificationId;
    private NotificationType type;
    private String title;
    private String message;
    private Long referenceId;
    private String referenceType;
    private LocalDateTime createdAt;
}
