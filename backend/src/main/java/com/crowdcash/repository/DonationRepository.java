package com.crowdcash.repository;

import com.crowdcash.model.Donation;
import com.crowdcash.model.enums.DonationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    Page<Donation> findByDonorId(Long donorId, Pageable pageable);

    Page<Donation> findByCampaignIdAndStatus(Long campaignId, DonationStatus status, Pageable pageable);

    @Query("SELECT COUNT(d) FROM Donation d WHERE d.campaign.id = :campaignId AND d.status = 'SUCCESS'")
    long countSuccessfulByCampaign(@Param("campaignId") Long campaignId);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.campaign.id = :campaignId AND d.status = 'SUCCESS'")
    BigDecimal sumAmountByCampaign(@Param("campaignId") Long campaignId);

    @Query("SELECT d FROM Donation d WHERE d.campaign.id = :campaignId AND d.status = 'SUCCESS' ORDER BY d.amount DESC")
    List<Donation> findTopDonorsByCampaign(@Param("campaignId") Long campaignId, Pageable pageable);

    Optional<Donation> findByIdAndDonorId(Long id, Long donorId);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.status = 'SUCCESS'")
    BigDecimal sumAllSuccessfulDonations();

    @Query("SELECT COUNT(DISTINCT d.donor.id) FROM Donation d WHERE d.status = 'SUCCESS'")
    long countDistinctDonors();

    @Query("SELECT d.donor, SUM(d.amount) as total, COUNT(d) as cnt FROM Donation d WHERE d.status = 'SUCCESS' GROUP BY d.donor ORDER BY total DESC")
    List<Object[]> findTopDonorsAllTime(Pageable pageable);

    @Query("SELECT d.donor, SUM(d.amount) as total, COUNT(d) as cnt FROM Donation d WHERE d.status = 'SUCCESS' AND d.createdAt >= :startDate GROUP BY d.donor ORDER BY total DESC")
    List<Object[]> findTopDonorsMonthly(@Param("startDate") java.time.LocalDateTime startDate, Pageable pageable);
}
