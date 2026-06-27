package com.crowdcash.repository;

import com.crowdcash.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByRecipientId(Long recipientId, Pageable pageable);
    long countByRecipientIdAndIsReadFalse(Long recipientId);
    List<Notification> findByRecipientIdAndIsReadFalse(Long recipientId);
}
