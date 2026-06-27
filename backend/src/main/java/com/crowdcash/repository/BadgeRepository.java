package com.crowdcash.repository;

import com.crowdcash.model.Badge;
import com.crowdcash.model.enums.BadgeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {
    Optional<Badge> findByType(BadgeType type);
}
