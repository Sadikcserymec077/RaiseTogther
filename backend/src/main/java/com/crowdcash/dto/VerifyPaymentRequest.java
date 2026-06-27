package com.crowdcash.dto;

import lombok.Data;

@Data
public class VerifyPaymentRequest {
    private Long donationId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
