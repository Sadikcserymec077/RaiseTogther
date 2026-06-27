package com.crowdcash.service;

import com.crowdcash.dto.*;
import com.crowdcash.exception.BadRequestException;
import com.crowdcash.exception.ResourceNotFoundException;
import com.crowdcash.model.*;
import com.crowdcash.model.enums.CampaignStatus;
import com.crowdcash.model.enums.DonationStatus;
import com.crowdcash.model.enums.PaymentStatus;
import com.crowdcash.repository.*;
import com.razorpay.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationService {

    @Autowired private DonationRepository donationRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private CampaignRepository campaignRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RewardService rewardService;
    @Autowired private ReceiptService receiptService;
    @Autowired private RazorpayService razorpayService;
    @Autowired private EmailService emailService;
    @Autowired private WebSocketService webSocketService;
    @Autowired private NotificationService notificationService;

    // ── Initiate Donation ──────────────────────────────────────────────────────

    @Transactional
    public InitiateDonationResponse initiateDonation(InitiateDonationRequest req, Long userId) {
        Campaign campaign = campaignRepository.findById(req.getCampaignId())
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));

        if (campaign.getStatus() != CampaignStatus.APPROVED)
            throw new BadRequestException("This campaign is not accepting donations");

        if (req.getAmount() == null || req.getAmount().compareTo(BigDecimal.ONE) < 0)
            throw new BadRequestException("Donation amount must be at least ₹1");

        User donor = null;
        if (userId != null) {
            donor = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        }

        // Create Donation
        Donation donation = Donation.builder()
                .donor(donor)
                .campaign(campaign)
                .amount(req.getAmount())
                .isAnonymous(req.isAnonymous())
                .message(req.getMessage())
                .status(DonationStatus.PENDING)
                .build();
        donation = donationRepository.save(donation);

        // Create Razorpay Order
        try {
            Order rzpOrder = razorpayService.createOrder(req.getAmount(), "CC-" + donation.getId());
            String rzpOrderId = rzpOrder.get("id");

            // Create Payment record
            Payment payment = Payment.builder()
                    .razorpayOrderId(rzpOrderId)
                    .amount(req.getAmount())
                    .status(PaymentStatus.CREATED)
                    .donation(donation)
                    .build();
            paymentRepository.save(payment);

            return InitiateDonationResponse.builder()
                    .razorpayOrderId(rzpOrderId)
                    .amount(req.getAmount())
                    .currency("INR")
                    .razorpayKeyId(razorpayService.getKeyId())
                    .donationId(donation.getId())
                    .campaignTitle(campaign.getTitle())
                    .donorName(donor != null ? donor.getName() : "Anonymous")
                    .donorEmail(donor != null ? donor.getEmail() : "")
                    .build();
        } catch (Exception e) {
            throw new BadRequestException("Failed to create payment order: " + e.getMessage());
        }
    }

    // ── Verify Payment ─────────────────────────────────────────────────────────

    @Transactional
    public DonationSuccessResponse verifyPayment(VerifyPaymentRequest req) {
        Donation donation = donationRepository.findById(req.getDonationId())
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found"));

        Payment payment = paymentRepository.findByRazorpayOrderId(req.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found"));

        // Verify HMAC signature
        boolean valid = razorpayService.verifySignature(
                req.getRazorpayOrderId(), req.getRazorpayPaymentId(), req.getRazorpaySignature());

        if (!valid) {
            donation.setStatus(DonationStatus.FAILED);
            payment.setStatus(PaymentStatus.FAILED);
            donationRepository.save(donation);
            paymentRepository.save(payment);
            throw new BadRequestException("Payment signature verification failed");
        }

        // Update payment
        payment.setRazorpayPaymentId(req.getRazorpayPaymentId());
        payment.setRazorpaySignature(req.getRazorpaySignature());
        payment.setStatus(PaymentStatus.CAPTURED);
        paymentRepository.save(payment);

        // Update donation
        donation.setStatus(DonationStatus.SUCCESS);
        donation.setPayment(payment);

        // Assign reward
        Reward reward = rewardService.assignReward(donation);
        if (reward != null) donation.setReward(reward);
        donation = donationRepository.save(donation);

        // Update campaign stats
        Campaign campaign = donation.getCampaign();
        campaign.setRaisedAmount(campaign.getRaisedAmount().add(donation.getAmount()));
        campaign.setDonorCount(campaign.getDonorCount() + 1);
        boolean goalJustReached = campaign.getRaisedAmount().compareTo(campaign.getGoalAmount()) >= 0
                && campaign.getRaisedAmount().subtract(donation.getAmount()).compareTo(campaign.getGoalAmount()) < 0;
        campaignRepository.save(campaign);

        // Generate receipt
        Receipt receipt = receiptService.generateReceipt(donation);

        // Notifications
        if (donation.getDonor() != null) {
            notificationService.createNotification(
                    donation.getDonor().getId(),
                    com.crowdcash.model.enums.NotificationType.DONATION_SUCCESS,
                    "Donation Successful!",
                    "Thank you for donating ₹" + donation.getAmount() + " to \"" + campaign.getTitle() + "\"",
                    donation.getId(),
                    "DONATION"
            );
            if (reward != null) {
                notificationService.createNotification(
                        donation.getDonor().getId(),
                        com.crowdcash.model.enums.NotificationType.REWARD_ASSIGNED,
                        "Reward Assigned",
                        "You've been assigned the reward: \"" + reward.getTitle() + "\" for your donation.",
                        campaign.getId(),
                        "CAMPAIGN"
                );
            }
        }

        if (goalJustReached) {
            notificationService.createNotification(
                    campaign.getCreator().getId(),
                    com.crowdcash.model.enums.NotificationType.CAMPAIGN_GOAL_ACHIEVED,
                    "Campaign Goal Achieved!",
                    "Congratulations! Your campaign \"" + campaign.getTitle() + "\" has achieved its goal!",
                    campaign.getId(),
                    "CAMPAIGN"
            );
        }

        // Broadcast websocket event
        try {
            double progress = campaign.getGoalAmount().doubleValue() > 0
                    ? (campaign.getRaisedAmount().doubleValue() / campaign.getGoalAmount().doubleValue()) * 100
                    : 0;

            String donorName = donation.getIsAnonymous() ? "Anonymous"
                    : (donation.getDonor() != null ? donation.getDonor().getName() : "Anonymous");

            com.crowdcash.dto.DonationEventMessage wsMsg = com.crowdcash.dto.DonationEventMessage.builder()
                    .type(goalJustReached ? "GOAL_ACHIEVED" : "NEW_DONATION")
                    .campaignId(campaign.getId())
                    .raisedAmount(campaign.getRaisedAmount())
                    .goalAmount(campaign.getGoalAmount())
                    .progressPercent(progress)
                    .donorCount(campaign.getDonorCount())
                    .donorDisplayName(donorName)
                    .donationAmount(donation.getAmount())
                    .timestamp(java.time.LocalDateTime.now())
                    .build();

            webSocketService.broadcastDonationEvent(campaign.getId(), wsMsg);
        } catch (Exception e) {
            System.err.println("Failed to broadcast WS event: " + e.getMessage());
        }

        // Send emails best-effort
        try { emailService.sendDonationConfirmationEmail(donation, receipt); } catch (Exception ignored) {}
        if (goalJustReached) {
            try { emailService.sendGoalAchievedEmail(campaign); } catch (Exception ignored) {}
        }

        return DonationSuccessResponse.builder()
                .donationId(donation.getId())
                .receiptNumber(receipt.getReceiptNumber())
                .amount(donation.getAmount())
                .campaignTitle(campaign.getTitle())
                .rewardTitle(reward != null ? reward.getTitle() : null)
                .message(donation.getMessage())
                .paymentId(req.getRazorpayPaymentId())
                .build();
    }

    // ── Queries ────────────────────────────────────────────────────────────────

    public Page<DonationResponse> getDonationHistory(Long userId, Pageable pageable) {
        return donationRepository.findByDonorId(userId, pageable).map(this::toResponse);
    }

    public DonationResponse getDonationById(Long id, Long userId) {
        Donation donation = donationRepository.findByIdAndDonorId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found"));
        return toResponse(donation);
    }

    public Page<DonorSummary> getCampaignDonations(Long campaignId, Pageable pageable) {
        return donationRepository.findByCampaignIdAndStatus(campaignId, DonationStatus.SUCCESS, pageable)
                .map(this::toDonorSummary);
    }

    public CampaignDonationStatsResponse getCampaignDonationStats(Long campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));

        BigDecimal totalRaised = donationRepository.sumAmountByCampaign(campaignId);
        long donorCount = donationRepository.countSuccessfulByCampaign(campaignId);
        double progress = campaign.getGoalAmount().compareTo(BigDecimal.ZERO) > 0
                ? totalRaised.divide(campaign.getGoalAmount(), 4, RoundingMode.HALF_UP).doubleValue() * 100
                : 0;

        List<DonorSummary> topDonors = donationRepository
                .findTopDonorsByCampaign(campaignId, PageRequest.of(0, 5))
                .stream().map(this::toDonorSummary).collect(Collectors.toList());

        List<DonorSummary> recentDonors = donationRepository
                .findByCampaignIdAndStatus(campaignId, DonationStatus.SUCCESS, PageRequest.of(0, 10))
                .stream().map(this::toDonorSummary).collect(Collectors.toList());

        return CampaignDonationStatsResponse.builder()
                .totalRaised(totalRaised)
                .donorCount(donorCount)
                .goalAmount(campaign.getGoalAmount())
                .progressPercent(Math.min(progress, 100))
                .topDonors(topDonors)
                .recentDonors(recentDonors)
                .build();
    }

    // ── Admin ──────────────────────────────────────────────────────────────────

    public Page<DonationResponse> getAllDonations(Pageable pageable) {
        return donationRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional
    public void refundDonation(Long id) {
        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found"));
        donation.setStatus(DonationStatus.REFUNDED);
        if (donation.getPayment() != null) {
            donation.getPayment().setStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(donation.getPayment());
        }
        // Reverse campaign stats
        Campaign campaign = donation.getCampaign();
        campaign.setRaisedAmount(campaign.getRaisedAmount().subtract(donation.getAmount()).max(BigDecimal.ZERO));
        campaign.setDonorCount(Math.max(campaign.getDonorCount() - 1, 0));
        campaignRepository.save(campaign);
        donationRepository.save(donation);
    }

    // ── Mappers ────────────────────────────────────────────────────────────────

    private DonationResponse toResponse(Donation d) {
        String receiptNumber = d.getReceipt() != null ? d.getReceipt().getReceiptNumber() : null;
        String paymentId = d.getPayment() != null ? d.getPayment().getRazorpayPaymentId() : null;
        return DonationResponse.builder()
                .id(d.getId())
                .amount(d.getAmount())
                .isAnonymous(d.getIsAnonymous())
                .message(d.getMessage())
                .status(d.getStatus())
                .campaignId(d.getCampaign().getId())
                .campaignTitle(d.getCampaign().getTitle())
                .campaignThumbnail(d.getCampaign().getThumbnailImage())
                .donorName(d.getDonor() != null ? d.getDonor().getName() : "Anonymous")
                .rewardTitle(d.getReward() != null ? d.getReward().getTitle() : null)
                .receiptNumber(receiptNumber)
                .paymentId(paymentId)
                .createdAt(d.getCreatedAt())
                .build();
    }

    private DonorSummary toDonorSummary(Donation d) {
        String displayName = (d.getIsAnonymous() || d.getDonor() == null) ? "Anonymous" : d.getDonor().getName();
        String avatar = (!d.getIsAnonymous() && d.getDonor() != null) ? d.getDonor().getProfilePicture() : null;
        return DonorSummary.builder()
                .displayName(displayName)
                .amount(d.getAmount())
                .message(d.getMessage())
                .avatarUrl(avatar)
                .createdAt(d.getCreatedAt())
                .build();
    }
}
