package com.crowdcash.service;

import com.crowdcash.model.Donation;
import com.crowdcash.model.Receipt;
import com.crowdcash.repository.ReceiptRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    @Value("${receipt.storage-dir:./receipts/}")
    private String storageDir;

    @Value("${receipt.number-prefix:CC}")
    private String prefix;

    @Autowired
    private ReceiptRepository receiptRepository;

    public String generateReceiptPdf(Receipt receipt, Donation donation) throws Exception {
        // Ensure directory exists
        Path dir = Paths.get(storageDir);
        Files.createDirectories(dir);

        String fileName = receipt.getReceiptNumber() + ".pdf";
        String filePath = dir.resolve(fileName).toAbsolutePath().toString();

        try (PdfWriter writer = new PdfWriter(new FileOutputStream(filePath));
             PdfDocument pdf = new PdfDocument(writer);
             Document document = new Document(pdf)) {

            DeviceRgb primaryColor = new DeviceRgb(99, 102, 241); // Indigo

            // === Header ===
            Paragraph header = new Paragraph("RaiseTogether")
                    .setFontSize(28)
                    .setBold()
                    .setFontColor(primaryColor)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(4);
            document.add(header);

            Paragraph subheader = new Paragraph("Donation Receipt")
                    .setFontSize(14)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(subheader);

            // === Receipt Number Banner ===
            Paragraph receiptBanner = new Paragraph("Receipt No: " + receipt.getReceiptNumber())
                    .setFontSize(12)
                    .setBold()
                    .setBackgroundColor(new DeviceRgb(238, 242, 255))
                    .setPadding(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(receiptBanner);

            // === Details Table ===
            Table table = new Table(UnitValue.createPercentArray(new float[]{40, 60}))
                    .setWidth(UnitValue.createPercentValue(100))
                    .setMarginBottom(20);

            String donorName = (donation.getIsAnonymous() || donation.getDonor() == null)
                    ? "Anonymous Donor"
                    : donation.getDonor().getName();

            String paymentId = (donation.getPayment() != null && donation.getPayment().getRazorpayPaymentId() != null)
                    ? donation.getPayment().getRazorpayPaymentId()
                    : "N/A";

            addTableRow(table, "Donor", donorName);
            addTableRow(table, "Campaign", donation.getCampaign().getTitle());
            addTableRow(table, "Amount", "₹" + donation.getAmount().toPlainString());
            addTableRow(table, "Payment ID", paymentId);
            addTableRow(table, "Date & Time", donation.getCreatedAt().format(
                    DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")));

            if (donation.getReward() != null) {
                addTableRow(table, "Reward Earned", donation.getReward().getTitle());
            }
            if (donation.getMessage() != null && !donation.getMessage().isBlank()) {
                addTableRow(table, "Message", donation.getMessage());
            }

            document.add(table);

            // === QR Code ===
            try {
                byte[] qrBytes = generateQrCode(receipt.getQrCodeData(), 150);
                Image qrImage = new Image(ImageDataFactory.create(qrBytes))
                        .setWidth(100)
                        .setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);
                document.add(new Paragraph("Scan to verify").setTextAlignment(TextAlignment.CENTER).setFontSize(10).setFontColor(ColorConstants.GRAY));
                document.add(qrImage);
            } catch (Exception ignored) { /* QR generation best-effort */ }

            // === Footer ===
            document.add(new Paragraph("\nThank you for supporting this campaign! 💙")
                    .setFontSize(12)
                    .setBold()
                    .setFontColor(primaryColor)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(20));

            document.add(new Paragraph("This is a system-generated receipt. No signature required.")
                    .setFontSize(9)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER));
        }

        return filePath;
    }

    private void addTableRow(Table table, String label, String value) {
        DeviceRgb borderColor = new DeviceRgb(229, 231, 235);
        table.addCell(new Cell().add(new Paragraph(label).setBold().setFontSize(11))
                .setBorder(new SolidBorder(borderColor, 1))
                .setPadding(8));
        table.addCell(new Cell().add(new Paragraph(value).setFontSize(11))
                .setBorder(new SolidBorder(borderColor, 1))
                .setPadding(8));
    }

    private byte[] generateQrCode(String data, int size) throws Exception {
        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix matrix = writer.encode(data, BarcodeFormat.QR_CODE, size, size);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", baos);
        return baos.toByteArray();
    }

    public String generateReceiptNumber(Long sequenceId) {
        return String.format("%s-%d-%06d", prefix, java.time.LocalDate.now().getYear(), sequenceId);
    }
}
