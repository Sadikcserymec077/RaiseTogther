package com.crowdcash.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "campaign_images")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CampaignImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    private Integer displayOrder;
}
