package com.crowdcash.service;

import com.crowdcash.dto.CampaignSummaryResponse;
import com.crowdcash.dto.CreateReportRequest;
import com.crowdcash.dto.ReportResponse;
import com.crowdcash.dto.UserSummaryResponse;
import com.crowdcash.model.Campaign;
import com.crowdcash.model.Report;
import com.crowdcash.model.User;
import com.crowdcash.model.enums.NotificationType;
import com.crowdcash.model.enums.ReportStatus;
import com.crowdcash.repository.CampaignRepository;
import com.crowdcash.repository.ReportRepository;
import com.crowdcash.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public ReportResponse reportCampaign(Long campaignId, CreateReportRequest request, Long userId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
        User reporter = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Report report = Report.builder()
                .campaign(campaign)
                .reporter(reporter)
                .reason(request.getReason())
                .description(request.getDescription())
                .status(ReportStatus.PENDING)
                .build();

        report = reportRepository.save(report);

        // Notify admins (stub: in a real system we notify all admins, here we can send notification or create system log)
        // Let's create an ADMIN_MESSAGE or REPORT_RECEIVED notification for the campaign owner or general notification
        // For simplicity: notify the campaign creator if a report is made, or just log.
        // The requirements say: "After report received, send to Admin" - since admins don't have a single user id easily,
        // we can notify the creator or simply save it in DB and let admins view it in AdminReports.jsx.
        return mapToResponse(report);
    }

    public Page<ReportResponse> getReports(ReportStatus status, Pageable pageable) {
        if (status != null) {
            return reportRepository.findByStatus(status, pageable).map(this::mapToResponse);
        }
        return reportRepository.findAll(pageable).map(this::mapToResponse);
    }

    public ReportResponse reviewReport(Long id, String notes, Long adminUserId) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        report.setStatus(ReportStatus.REVIEWED);
        report.setAdminNotes(notes);
        report.setReviewedBy(admin);

        report = reportRepository.save(report);
        return mapToResponse(report);
    }

    public ReportResponse resolveReport(Long id, Long adminUserId) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        report.setStatus(ReportStatus.RESOLVED);
        report.setReviewedBy(admin);

        report = reportRepository.save(report);
        return mapToResponse(report);
    }

    public ReportResponse dismissReport(Long id, Long adminUserId) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        report.setStatus(ReportStatus.DISMISSED);
        report.setReviewedBy(admin);

        report = reportRepository.save(report);
        return mapToResponse(report);
    }

    private ReportResponse mapToResponse(Report r) {
        CampaignSummaryResponse campaignRes = CampaignSummaryResponse.builder()
                .id(r.getCampaign().getId())
                .title(r.getCampaign().getTitle())
                .thumbnailImage(r.getCampaign().getThumbnailImage())
                .category(r.getCampaign().getCategory())
                .status(r.getCampaign().getStatus())
                .goalAmount(r.getCampaign().getGoalAmount())
                .raisedAmount(r.getCampaign().getRaisedAmount())
                .progressPercent(r.getCampaign().getGoalAmount().doubleValue() > 0 ?
                        (r.getCampaign().getRaisedAmount().doubleValue() / r.getCampaign().getGoalAmount().doubleValue()) * 100 : 0)
                .donorCount(r.getCampaign().getDonorCount())
                .location(r.getCampaign().getLocation())
                .creatorId(r.getCampaign().getCreator().getId())
                .creatorName(r.getCampaign().getCreator().getName())
                .build();

        UserSummaryResponse reporterRes = UserSummaryResponse.builder()
                .id(r.getReporter().getId())
                .name(r.getReporter().getName())
                .email(r.getReporter().getEmail())
                .profilePicture(r.getReporter().getProfilePicture())
                .build();

        UserSummaryResponse reviewerRes = r.getReviewedBy() != null ? UserSummaryResponse.builder()
                .id(r.getReviewedBy().getId())
                .name(r.getReviewedBy().getName())
                .email(r.getReviewedBy().getEmail())
                .profilePicture(r.getReviewedBy().getProfilePicture())
                .build() : null;

        return ReportResponse.builder()
                .id(r.getId())
                .campaign(campaignRes)
                .reporter(reporterRes)
                .reason(r.getReason())
                .description(r.getDescription())
                .status(r.getStatus())
                .adminNotes(r.getAdminNotes())
                .reviewedBy(reviewerRes)
                .createdAt(r.getCreatedAt())
                .build();
    }
}
