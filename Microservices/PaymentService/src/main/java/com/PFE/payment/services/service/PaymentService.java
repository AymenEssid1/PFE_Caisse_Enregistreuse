package com.PFE.payment.services.service;

import com.PFE.payment.entities.Payment;
import com.PFE.payment.entities.PaymentRequestDto;

import java.util.List;

public interface PaymentService {
    List<Payment> getAllPayments();
    Payment getPaymentById(Integer id);
    public Payment createPayment(PaymentRequestDto paymentRequest);
    void deletePayment(Integer id);
}

