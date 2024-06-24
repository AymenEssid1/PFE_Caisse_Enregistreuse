package com.PFE.payment.entities;


import lombok.Data;

@Data
public class PaymentRequestDto {
    private Integer clientId;
    private PayType payType;
    private boolean status;
    private Integer orderId;
    private Integer establishmentId;
    private float paidAmount;


    // Getters and Setters
}
