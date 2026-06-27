package com.crowdcash.service;

import com.crowdcash.exception.BadRequestException;
import com.crowdcash.exception.ResourceNotFoundException;
import com.crowdcash.model.Bookmark;
import com.crowdcash.model.Campaign;
import com.crowdcash.model.User;
import com.crowdcash.repository.BookmarkRepository;
import com.crowdcash.repository.CampaignRepository;
import com.crowdcash.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookmarkService {

    @Autowired private BookmarkRepository bookmarkRepository;
    @Autowired private CampaignRepository campaignRepository;
    @Autowired private UserRepository userRepository;

    @Transactional
    public void addBookmark(Long userId, Long campaignId) {
        if (bookmarkRepository.existsByUserIdAndCampaignId(userId, campaignId))
            throw new BadRequestException("Campaign already bookmarked");
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Campaign campaign = campaignRepository.findById(campaignId).orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
        bookmarkRepository.save(Bookmark.builder().user(user).campaign(campaign).build());
    }

    @Transactional
    public void removeBookmark(Long userId, Long campaignId) {
        Bookmark bookmark = bookmarkRepository.findByUserIdAndCampaignId(userId, campaignId)
                .orElseThrow(() -> new ResourceNotFoundException("Bookmark not found"));
        bookmarkRepository.delete(bookmark);
    }

    public Page<Campaign> getBookmarkedCampaigns(Long userId, Pageable pageable) {
        return bookmarkRepository.findBookmarkedCampaignsByUserId(userId, pageable);
    }

    public boolean isBookmarked(Long userId, Long campaignId) {
        return bookmarkRepository.existsByUserIdAndCampaignId(userId, campaignId);
    }
}
