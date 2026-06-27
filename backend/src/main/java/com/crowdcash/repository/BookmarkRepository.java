package com.crowdcash.repository;

import com.crowdcash.model.Bookmark;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    boolean existsByUserIdAndCampaignId(Long userId, Long campaignId);
    Optional<Bookmark> findByUserIdAndCampaignId(Long userId, Long campaignId);

    @Query("SELECT b.campaign FROM Bookmark b WHERE b.user.id = :userId")
    Page<com.crowdcash.model.Campaign> findBookmarkedCampaignsByUserId(@Param("userId") Long userId, Pageable pageable);
}
