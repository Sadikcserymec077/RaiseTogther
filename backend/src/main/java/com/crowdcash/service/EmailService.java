package com.crowdcash.service;

import com.crowdcash.model.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(User user, String token) {
        String url = frontendUrl + "/verify-email?token=" + token;
        String subject = "Verify your RaiseTogether Account";
        String htmlBody = "<h3>Welcome to RaiseTogether, " + user.getName() + "!</h3>" +
                "<p>Please click the link below to verify your email address:</p>" +
                "<a href=\"" + url + "\">Verify Email</a>" +
                "<p>If you didn't request this, please ignore this email.</p>";
        
        sendHtmlEmail(user.getEmail(), subject, htmlBody);
    }

    public void sendPasswordResetEmail(User user, String token) {
        String url = frontendUrl + "/reset-password?token=" + token;
        String subject = "Reset your RaiseTogether Password";
        String htmlBody = "<h3>Hello " + user.getName() + ",</h3>" +
                "<p>You requested a password reset. Click the link below to reset it:</p>" +
                "<a href=\"" + url + "\">Reset Password</a>" +
                "<p>If you didn't request this, please ignore this email.</p>";
        
        sendHtmlEmail(user.getEmail(), subject, htmlBody);
    }

    public void sendWelcomeEmail(User user) {
        String subject = "Welcome to RaiseTogether!";
        String htmlBody = "<h3>Welcome aboard, " + user.getName() + "!</h3>" +
                "<p>We're excited to have you join our crowdfunding community.</p>";
        
        sendHtmlEmail(user.getEmail(), subject, htmlBody);
    }
    
    public void sendCampaignApprovedEmail(User creator, com.crowdcash.model.Campaign campaign) {
        String subject = "🎉 Your Campaign Has Been Approved — RaiseTogether";
        String htmlBody = "<h3>Great news, " + creator.getName() + "!</h3>" +
                "<p>Your campaign <strong>\"" + campaign.getTitle() + "\"</strong> has been approved and is now live on RaiseTogether.</p>" +
                "<p>Share it with your friends and family to start raising funds!</p>" +
                "<a href=\"" + frontendUrl + "/campaigns/" + campaign.getId() + "\">View Campaign</a>";
        sendHtmlEmail(creator.getEmail(), subject, htmlBody);
    }

    public void sendCampaignRejectedEmail(User creator, com.crowdcash.model.Campaign campaign, String remarks) {
        String subject = "Campaign Review Update — RaiseTogether";
        String htmlBody = "<h3>Hello " + creator.getName() + ",</h3>" +
                "<p>Unfortunately, your campaign <strong>\"" + campaign.getTitle() + "\"</strong> was not approved at this time.</p>" +
                "<p><strong>Admin Remarks:</strong> " + remarks + "</p>" +
                "<p>You may edit and resubmit your campaign after addressing the feedback.</p>";
        sendHtmlEmail(creator.getEmail(), subject, htmlBody);
    }

    public void sendCampaignExpiredEmail(User creator, com.crowdcash.model.Campaign campaign) {
        String subject = "Your Campaign Has Expired — RaiseTogether";
        String htmlBody = "<h3>Hello " + creator.getName() + ",</h3>" +
                "<p>Your campaign <strong>\"" + campaign.getTitle() + "\"</strong> has reached its deadline and has been marked as expired.</p>" +
                "<p>Thank you for using RaiseTogether. You can create a new campaign anytime.</p>";
        sendHtmlEmail(creator.getEmail(), subject, htmlBody);
    }

    public void sendDonationConfirmationEmail(com.crowdcash.model.Donation donation, com.crowdcash.model.Receipt receipt) {
        if (donation.getDonor() == null || donation.getIsAnonymous()) return;
        String subject = "💙 Donation Confirmed — Receipt #" + receipt.getReceiptNumber();
        String htmlBody = "<h3>Thank you for your donation, " + donation.getDonor().getName() + "!</h3>" +
                "<p>Your donation of <strong>₹" + donation.getAmount().toPlainString() + "</strong> to <strong>\"" + donation.getCampaign().getTitle() + "\"</strong> was successful.</p>" +
                "<p><strong>Receipt Number:</strong> " + receipt.getReceiptNumber() + "</p>" +
                (donation.getReward() != null ? "<p><strong>Reward Earned:</strong> " + donation.getReward().getTitle() + "</p>" : "") +
                "<p>Your receipt is attached to this email.</p>" +
                "<a href=\"" + frontendUrl + "/campaigns/" + donation.getCampaign().getId() + "\">View Campaign</a>" +
                "<p style='color:#6b7280;font-size:12px;margin-top:20px;'>RaiseTogether — Empowering dreams through community funding.</p>";
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "RaiseTogether");
            helper.setTo(donation.getDonor().getEmail());
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            if (receipt.getPdfPath() != null) {
                java.io.File pdfFile = new java.io.File(receipt.getPdfPath());
                if (pdfFile.exists()) {
                    helper.addAttachment(receipt.getReceiptNumber() + ".pdf",
                            new org.springframework.core.io.FileSystemResource(pdfFile));
                }
            }
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send donation confirmation email: " + e.getMessage());
        }
    }

    public void sendGoalAchievedEmail(com.crowdcash.model.Campaign campaign) {
        String subject = "🎯 Goal Reached! Your campaign hit its target — RaiseTogether";
        String htmlBody = "<h3>Congratulations, " + campaign.getCreator().getName() + "!</h3>" +
                "<p>Your campaign <strong>\"" + campaign.getTitle() + "\"</strong> has reached its funding goal of <strong>₹" + campaign.getGoalAmount().toPlainString() + "</strong>!</p>" +
                "<p>Your total raised so far: <strong>₹" + campaign.getRaisedAmount().toPlainString() + "</strong></p>" +
                "<p>Thank you for using RaiseTogether to make a difference!</p>" +
                "<a href=\"" + frontendUrl + "/campaigns/" + campaign.getId() + "\">View Campaign</a>";
        sendHtmlEmail(campaign.getCreator().getEmail(), subject, htmlBody);
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "RaiseTogether");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            System.out.println("Email successfully sent to: " + to);
        } catch (MessagingException | UnsupportedEncodingException e) {
            System.err.println("Failed to send email to: " + to);
            e.printStackTrace();
        }
    }
}
