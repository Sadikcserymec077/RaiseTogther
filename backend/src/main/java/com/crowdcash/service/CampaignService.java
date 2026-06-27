package com.crowdcash.service;

import com.crowdcash.dto.*;
import com.crowdcash.exception.BadRequestException;
import com.crowdcash.exception.ResourceNotFoundException;
import com.crowdcash.exception.UnauthorizedException;
import com.crowdcash.model.*;
import com.crowdcash.model.enums.CampaignCategory;
import com.crowdcash.model.enums.CampaignStatus;
import com.crowdcash.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CampaignService {

    @Autowired private CampaignRepository campaignRepository;
    @Autowired private CampaignImageRepository campaignImageRepository;
    @Autowired private CampaignUpdateRepository campaignUpdateRepository;
    @Autowired private VerificationRepository verificationRepository;
    @Autowired private BookmarkRepository bookmarkRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private FileStorageService fileStorageService;
    @Autowired private EmailService emailService;
    @Autowired private NotificationService notificationService;

    // ── Public Queries ────────────────────────────────────────────────────────

    public Page<CampaignSummaryResponse> getApprovedCampaigns(
            CampaignCategory category, String location, String search,
            BigDecimal minGoal, BigDecimal maxGoal, Pageable pageable) {
        return campaignRepository.findFiltered(category, location, search, minGoal, maxGoal, pageable)
                .map(this::toSummary);
    }

    @Transactional
    public CampaignResponse getCampaignById(Long id, Long currentUserId) {
        Campaign campaign = findCampaignOrThrow(id);
        campaign.setViewCount(campaign.getViewCount() + 1);
        campaignRepository.save(campaign);
        boolean bookmarked = currentUserId != null && bookmarkRepository.existsByUserIdAndCampaignId(currentUserId, id);
        return toResponse(campaign, bookmarked);
    }

    public List<CampaignSummaryResponse> getFeaturedCampaigns() {
        return campaignRepository.findByIsFeaturedTrueAndStatus(CampaignStatus.APPROVED)
                .stream().map(this::toSummary).collect(Collectors.toList());
    }

    public List<CampaignSummaryResponse> getEndingSoonCampaigns() {
        return campaignRepository.findEndingSoon(LocalDate.now(), LocalDate.now().plusDays(7))
                .stream().map(this::toSummary).collect(Collectors.toList());
    }

    public List<CampaignSummaryResponse> getTrendingCampaigns() {
        LocalDateTime since = LocalDateTime.now().minusDays(30);
        return campaignRepository.findTrending(since, PageRequest.of(0, 10))
                .stream().map(this::toSummary).collect(Collectors.toList());
    }

    public Page<CampaignSummaryResponse> getMyCampaigns(Long userId, Pageable pageable) {
        return campaignRepository.findByCreatorId(userId, pageable).map(this::toSummary);
    }

    // ── CRUD ─────────────────────────────────────────────────────────────────

    @Transactional
    public CampaignResponse createCampaign(CreateCampaignRequest req, Long userId, MultipartFile thumbnail, MultipartFile identityDoc) {
        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Campaign campaign = Campaign.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .story(req.getStory())
                .goalAmount(req.getGoalAmount())
                .category(req.getCategory())
                .location(req.getLocation())
                .deadline(req.getDeadline())
                .creator(creator)
                .status(CampaignStatus.PENDING)
                .build();

        if (thumbnail != null && !thumbnail.isEmpty()) {
            String url = fileStorageService.storeFile(thumbnail);
            campaign.setThumbnailImage(url);
        }

        if (identityDoc != null && !identityDoc.isEmpty()) {
            String url = fileStorageService.storeFile(identityDoc);
            campaign.setVerificationDocument(url);
        }

        campaignRepository.save(campaign);
        return toResponse(campaign, false);
    }

    @Transactional
    public CampaignResponse updateCampaign(Long id, UpdateCampaignRequest req, Long userId) {
        Campaign campaign = findCampaignOrThrow(id);
        assertOwner(campaign, userId);
        assertEditable(campaign);

        if (req.getTitle() != null) campaign.setTitle(req.getTitle());
        if (req.getDescription() != null) campaign.setDescription(req.getDescription());
        if (req.getStory() != null) campaign.setStory(req.getStory());
        if (req.getGoalAmount() != null) campaign.setGoalAmount(req.getGoalAmount());
        if (req.getCategory() != null) campaign.setCategory(req.getCategory());
        if (req.getLocation() != null) campaign.setLocation(req.getLocation());
        if (req.getDeadline() != null) campaign.setDeadline(req.getDeadline());

        campaignRepository.save(campaign);
        return toResponse(campaign, bookmarkRepository.existsByUserIdAndCampaignId(userId, id));
    }

    @Transactional
    public void deleteCampaign(Long id, Long userId) {
        Campaign campaign = findCampaignOrThrow(id);
        assertOwner(campaign, userId);
        assertEditable(campaign);
        campaignRepository.delete(campaign);
    }

    @Transactional
    public void pauseCampaign(Long id, Long userId) {
        Campaign campaign = findCampaignOrThrow(id);
        assertOwner(campaign, userId);
        if (campaign.getStatus() != CampaignStatus.APPROVED)
            throw new BadRequestException("Only APPROVED campaigns can be paused");
        campaign.setStatus(CampaignStatus.PAUSED);
        campaignRepository.save(campaign);
    }

    @Transactional
    public void resumeCampaign(Long id, Long userId) {
        Campaign campaign = findCampaignOrThrow(id);
        assertOwner(campaign, userId);
        if (campaign.getStatus() != CampaignStatus.PAUSED)
            throw new BadRequestException("Only PAUSED campaigns can be resumed");
        campaign.setStatus(CampaignStatus.APPROVED);
        campaignRepository.save(campaign);
    }

    // ── Images ────────────────────────────────────────────────────────────────

    @Transactional
    public String addCampaignImage(Long campaignId, Long userId, MultipartFile file) {
        Campaign campaign = findCampaignOrThrow(campaignId);
        assertOwner(campaign, userId);
        String url = fileStorageService.storeFile(file);
        int order = campaign.getImages().size();
        CampaignImage image = CampaignImage.builder().imageUrl(url).campaign(campaign).displayOrder(order).build();
        campaignImageRepository.save(image);
        return url;
    }

    @Transactional
    public void deleteCampaignImage(Long campaignId, Long imageId, Long userId) {
        Campaign campaign = findCampaignOrThrow(campaignId);
        assertOwner(campaign, userId);
        campaignImageRepository.deleteById(imageId);
    }

    // ── Updates ───────────────────────────────────────────────────────────────

    @Transactional
    public CampaignUpdateResponse postUpdate(Long campaignId, CampaignUpdateRequest req, Long userId) {
        Campaign campaign = findCampaignOrThrow(campaignId);
        assertOwner(campaign, userId);
        User poster = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        CampaignUpdate update = CampaignUpdate.builder()
                .title(req.getTitle())
                .content(req.getContent())
                .campaign(campaign)
                .postedBy(poster)
                .build();
        campaignUpdateRepository.save(update);
        return toUpdateResponse(update);
    }

    public List<CampaignUpdateResponse> getCampaignUpdates(Long campaignId) {
        return campaignUpdateRepository.findByCampaignIdOrderByCreatedAtDesc(campaignId)
                .stream().map(this::toUpdateResponse).collect(Collectors.toList());
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    public Page<CampaignSummaryResponse> getPendingCampaigns(Pageable pageable) {
        return campaignRepository.findByStatus(CampaignStatus.PENDING, pageable).map(this::toSummary);
    }

    public Page<CampaignSummaryResponse> getAllCampaigns(Pageable pageable) {
        return campaignRepository.findAll(pageable).map(this::toSummary);
    }

    @Transactional
    public CampaignResponse approveCampaign(Long id, Long adminId) {
        Campaign campaign = findCampaignOrThrow(id);
        campaign.setStatus(CampaignStatus.APPROVED);
        campaignRepository.save(campaign);
        try {
            notificationService.createNotification(
                    campaign.getCreator().getId(),
                    com.crowdcash.model.enums.NotificationType.CAMPAIGN_APPROVED,
                    "Campaign Approved!",
                    "Your campaign \"" + campaign.getTitle() + "\" has been approved and is now live.",
                    campaign.getId(),
                    "CAMPAIGN"
            );
        } catch (Exception ignored) {}
        try { emailService.sendCampaignApprovedEmail(campaign.getCreator(), campaign); } catch (Exception ignored) {}
        return toResponse(campaign, false);
    }

    @Transactional
    public CampaignResponse rejectCampaign(Long id, RejectCampaignRequest req, Long adminId) {
        Campaign campaign = findCampaignOrThrow(id);
        campaign.setStatus(CampaignStatus.REJECTED);
        campaignRepository.save(campaign);

        Verification verification = verificationRepository.findByCampaignId(id).orElse(
            Verification.builder().campaign(campaign).build()
        );
        verification.setAdminRemarks(req.getAdminRemarks());
        verificationRepository.save(verification);

        try {
            notificationService.createNotification(
                    campaign.getCreator().getId(),
                    com.crowdcash.model.enums.NotificationType.CAMPAIGN_REJECTED,
                    "Campaign Rejected",
                    "Your campaign \"" + campaign.getTitle() + "\" was rejected. Remarks: " + req.getAdminRemarks(),
                    campaign.getId(),
                    "CAMPAIGN"
            );
        } catch (Exception ignored) {}

        try { emailService.sendCampaignRejectedEmail(campaign.getCreator(), campaign, req.getAdminRemarks()); } catch (Exception ignored) {}
        return toResponse(campaign, false);
    }

    @Transactional
    public void toggleFeatured(Long id) {
        Campaign campaign = findCampaignOrThrow(id);
        campaign.setIsFeatured(!campaign.getIsFeatured());
        campaignRepository.save(campaign);
    }

    @Transactional
    public void expireCampaign(Long id) {
        Campaign campaign = findCampaignOrThrow(id);
        campaign.setStatus(CampaignStatus.EXPIRED);
        campaignRepository.save(campaign);
        try {
            notificationService.createNotification(
                    campaign.getCreator().getId(),
                    com.crowdcash.model.enums.NotificationType.CAMPAIGN_EXPIRED,
                    "Campaign Expired",
                    "Your campaign \"" + campaign.getTitle() + "\" has reached its deadline and is now expired.",
                    campaign.getId(),
                    "CAMPAIGN"
            );
        } catch (Exception ignored) {}
    }

    @Transactional
    public void forceDelete(Long id) {
        campaignRepository.deleteById(id);
    }

    // ── Scheduler ─────────────────────────────────────────────────────────────

    @Transactional
    public void checkAndExpireCampaigns() {
        List<Campaign> expired = campaignRepository.findByStatusAndDeadlineBefore(CampaignStatus.APPROVED, LocalDate.now());
        for (Campaign c : expired) {
            c.setStatus(CampaignStatus.EXPIRED);
            campaignRepository.save(c);
            try {
                notificationService.createNotification(
                        c.getCreator().getId(),
                        com.crowdcash.model.enums.NotificationType.CAMPAIGN_EXPIRED,
                        "Campaign Expired",
                        "Your campaign \"" + c.getTitle() + "\" has reached its deadline and is now expired.",
                        c.getId(),
                        "CAMPAIGN"
                );
            } catch (Exception ignored) {}
            try { emailService.sendCampaignExpiredEmail(c.getCreator(), c); } catch (Exception ignored) {}
        }
    }

    // ── Mappers ───────────────────────────────────────────────────────────────

    public CampaignSummaryResponse toSummary(Campaign c) {
        int days = (int) ChronoUnit.DAYS.between(LocalDate.now(), c.getDeadline());
        double progress = c.getGoalAmount().compareTo(BigDecimal.ZERO) > 0
                ? c.getRaisedAmount().divide(c.getGoalAmount(), 4, RoundingMode.HALF_UP).doubleValue() * 100
                : 0;
        return CampaignSummaryResponse.builder()
                .id(c.getId())
                .title(c.getTitle())
                .thumbnailImage(c.getThumbnailImage())
                .category(c.getCategory())
                .status(c.getStatus())
                .goalAmount(c.getGoalAmount())
                .raisedAmount(c.getRaisedAmount())
                .progressPercent(Math.min(progress, 100))
                .donorCount(c.getDonorCount())
                .daysRemaining(Math.max(days, 0))
                .location(c.getLocation())
                .creatorId(c.getCreator().getId())
                .creatorName(c.getCreator().getName())
                .creatorAvatar(c.getCreator().getProfilePicture())
                .isFeatured(c.getIsFeatured())
                .build();
    }

    public CampaignResponse toResponse(Campaign c, boolean bookmarked) {
        int days = (int) ChronoUnit.DAYS.between(LocalDate.now(), c.getDeadline());
        double progress = c.getGoalAmount().compareTo(BigDecimal.ZERO) > 0
                ? c.getRaisedAmount().divide(c.getGoalAmount(), 4, RoundingMode.HALF_UP).doubleValue() * 100
                : 0;
        List<String> imageUrls = c.getImages().stream().map(CampaignImage::getImageUrl).collect(Collectors.toList());
        UserSummaryResponse creator = UserSummaryResponse.builder()
                .id(c.getCreator().getId())
                .name(c.getCreator().getName())
                .profilePicture(c.getCreator().getProfilePicture())
                .build();
        return CampaignResponse.builder()
                .id(c.getId())
                .title(c.getTitle())
                .description(c.getDescription())
                .story(c.getStory())
                .goalAmount(c.getGoalAmount())
                .raisedAmount(c.getRaisedAmount())
                .progressPercent(Math.min(progress, 100))
                .category(c.getCategory())
                .status(c.getStatus())
                .location(c.getLocation())
                .deadline(c.getDeadline())
                .daysRemaining(Math.max(days, 0))
                .thumbnailImage(c.getThumbnailImage())
                .images(imageUrls)
                .donorCount(c.getDonorCount())
                .viewCount(c.getViewCount())
                .isFeatured(c.getIsFeatured())
                .isBookmarked(bookmarked)
                .creator(creator)
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }

    private CampaignUpdateResponse toUpdateResponse(CampaignUpdate u) {
        return CampaignUpdateResponse.builder()
                .id(u.getId())
                .title(u.getTitle())
                .content(u.getContent())
                .imageUrl(u.getImageUrl())
                .createdAt(u.getCreatedAt())
                .postedByName(u.getPostedBy().getName())
                .postedByAvatar(u.getPostedBy().getProfilePicture())
                .build();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Campaign findCampaignOrThrow(Long id) {
        return campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id: " + id));
    }

    private void assertOwner(Campaign campaign, Long userId) {
        if (!campaign.getCreator().getId().equals(userId))
            throw new UnauthorizedException("You are not the owner of this campaign");
    }

    private void assertEditable(Campaign campaign) {
        if (campaign.getStatus() != CampaignStatus.PENDING && campaign.getStatus() != CampaignStatus.PAUSED)
            throw new BadRequestException("Campaign can only be edited when PENDING or PAUSED");
    }
}
