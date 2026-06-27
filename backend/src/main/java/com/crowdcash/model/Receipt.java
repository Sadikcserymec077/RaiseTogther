package com.crowdcash.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "receipts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Receipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String receiptNumber; // e.g. CC-2024-000001

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation;

    @Column(length = 500)
    private String pdfPath; // local file path

    @Column(columnDefinition = "TEXT")
    private String qrCodeData; // JSON string with receipt info

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime issuedAt = LocalDateTime.now();
}
