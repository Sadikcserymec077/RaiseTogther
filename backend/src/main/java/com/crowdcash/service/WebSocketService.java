package com.crowdcash.service;

import com.crowdcash.dto.DonationEventMessage;
import com.crowdcash.dto.NotificationMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void broadcastDonationEvent(Long campaignId, DonationEventMessage message) {
        messagingTemplate.convertAndSend("/topic/campaign/" + campaignId, message);
    }

    public void sendPersonalNotification(Long userId, NotificationMessage message) {
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/notifications",
                message
        );
    }
}
