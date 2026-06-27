package com.crowdcash.service;

import com.crowdcash.exception.ResourceNotFoundException;
import com.crowdcash.exception.UnauthorizedException;
import com.crowdcash.model.Donation;
import com.crowdcash.model.Receipt;
import com.crowdcash.repository.DonationRepository;
import com.crowdcash.repository.ReceiptRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class ReceiptService {

    @Autowired private ReceiptRepository receiptRepository;
    @Autowired private DonationRepository donationRepository;
    @Autowired private PdfService pdfService;
    @Autowired private EmailService emailService;

    @Transactional
    public Receipt generateReceipt(Donation donation) {
        // Check if receipt already exists
        return receiptRepository.findByDonationId(donation.getId()).orElseGet(() -> {
            try {
                Long nextId = receiptRepository.findMaxId() + 1;
                String receiptNumber = pdfService.generateReceiptNumber(nextId);

                // Build QR code JSON payload
                Map<String, Object> qrData = new HashMap<>();
                qrData.put("receiptNo", receiptNumber);
                qrData.put("amount", donation.getAmount().toPlainString());
                qrData.put("campaignId", donation.getCampaign().getId());
                qrData.put("donationId", donation.getId());
                qrData.put("date", donation.getCreatedAt().toString());
                String qrJson = new ObjectMapper().writeValueAsString(qrData);

                Receipt receipt = Receipt.builder()
                        .receiptNumber(receiptNumber)
                        .donation(donation)
                        .qrCodeData(qrJson)
                        .build();
                receipt = receiptRepository.save(receipt);

                // Generate PDF
                String pdfPath = pdfService.generateReceiptPdf(receipt, donation);
                receipt.setPdfPath(pdfPath);
                return receiptRepository.save(receipt);
            } catch (Exception e) {
                throw new RuntimeException("Failed to generate receipt: " + e.getMessage(), e);
            }
        });
    }

    public Resource getReceiptPdf(Long donationId, Long userId) {
        Donation donation = donationRepository.findByIdAndDonorId(donationId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found"));
        Receipt receipt = receiptRepository.findByDonationId(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found. Please contact support."));
        return new FileSystemResource(receipt.getPdfPath());
    }

    public void emailReceipt(Long donationId, Long userId) {
        Donation donation = donationRepository.findByIdAndDonorId(donationId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found"));
        Receipt receipt = receiptRepository.findByDonationId(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found"));
        try {
            emailService.sendDonationConfirmationEmail(donation, receipt);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }
}
