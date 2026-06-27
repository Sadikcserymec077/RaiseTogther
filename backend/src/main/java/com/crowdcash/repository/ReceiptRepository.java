package com.crowdcash.repository;

import com.crowdcash.model.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
    Optional<Receipt> findByDonationId(Long donationId);

    @Query("SELECT COALESCE(MAX(r.id), 0) FROM Receipt r")
    Long findMaxId();
}
