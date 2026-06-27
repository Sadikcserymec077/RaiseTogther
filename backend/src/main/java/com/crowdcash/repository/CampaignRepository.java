package com.crowdcash.repository;

import com.crowdcash.model.Campaign;
import com.crowdcash.model.enums.CampaignCategory;
import com.crowdcash.model.enums.CampaignStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {

    Page<Campaign> findByStatus(CampaignStatus status, Pageable pageable);

    Page<Campaign> findByCreatorId(Long creatorId, Pageable pageable);

    List<Campaign> findByIsFeaturedTrueAndStatus(CampaignStatus status);

    @Query("SELECT c FROM Campaign c WHERE c.status = 'APPROVED' AND c.deadline BETWEEN :today AND :weekLater ORDER BY c.deadline ASC")
    List<Campaign> findEndingSoon(@Param("today") LocalDate today, @Param("weekLater") LocalDate weekLater);

    @Query("SELECT c FROM Campaign c WHERE c.status = 'APPROVED' AND c.createdAt >= :since ORDER BY c.donorCount DESC")
    List<Campaign> findTrending(@Param("since") java.time.LocalDateTime since, Pageable pageable);

    @Query("SELECT c FROM Campaign c WHERE c.status = 'APPROVED' AND " +
           "(:category IS NULL OR c.category = :category) AND " +
           "(:location IS NULL OR LOWER(c.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:minGoal IS NULL OR c.goalAmount >= :minGoal) AND " +
           "(:maxGoal IS NULL OR c.goalAmount <= :maxGoal)")
    Page<Campaign> findFiltered(
        @Param("category") CampaignCategory category,
        @Param("location") String location,
        @Param("search") String search,
        @Param("minGoal") java.math.BigDecimal minGoal,
        @Param("maxGoal") java.math.BigDecimal maxGoal,
        Pageable pageable
    );

    List<Campaign> findByStatusAndDeadlineBefore(CampaignStatus status, LocalDate date);

    @Query("SELECT c FROM Campaign c WHERE c.status = 'APPROVED' ORDER BY c.raisedAmount DESC")
    List<Campaign> findTopCampaigns(Pageable pageable);

    @Query("SELECT c.creator, SUM(c.raisedAmount) as totalRaised, COUNT(c) as cnt FROM Campaign c GROUP BY c.creator ORDER BY totalRaised DESC")
    List<Object[]> findTopCreators(Pageable pageable);
}
