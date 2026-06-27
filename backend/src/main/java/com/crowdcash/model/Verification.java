package com.crowdcash.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "verifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Verification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    private String identityDocUrl;
    private String medicalDocUrl;
    private String businessDocUrl;
    private String supportingDocUrl;

    @Column(columnDefinition = "TEXT")
    private String adminRemarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_id")
    private User reviewedBy;

    private LocalDateTime reviewedAt;
}
