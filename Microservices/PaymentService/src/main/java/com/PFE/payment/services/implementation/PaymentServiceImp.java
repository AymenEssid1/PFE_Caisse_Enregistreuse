package com.PFE.payment.services.implementation;

import com.PFE.payment.entities.Client;
import com.PFE.payment.entities.Payment;
import com.PFE.payment.entities.PaymentRequestDto;
import com.PFE.payment.repos.ClientRepository;
import com.PFE.payment.repos.PaymentRepository;
import com.PFE.payment.services.service.PaymentService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentServiceImp implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public Payment getPaymentById(Integer id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found with id " + id));
    }


@Override
    public Payment createPayment(PaymentRequestDto paymentRequest) {
        Payment payment = new Payment();

        if(paymentRequest.getClientId()==-1){

            payment.setClient(null);

        }else{
            Client client = clientRepository.findById(paymentRequest.getClientId())
                    .orElseThrow(() -> new EntityNotFoundException("Client not found"));
            payment.setClient(client);

        }



        payment.setPaymentDate(LocalDateTime.now());
        payment.setPayType(paymentRequest.getPayType());
        payment.setStatus(paymentRequest.isStatus());
        payment.setOrderId(paymentRequest.getOrderId());
        payment.setEstablishmentId(paymentRequest.getEstablishmentId());
        payment.setPaidAmount(paymentRequest.getPaidAmount());


        return paymentRepository.save(payment);
    }

    @Override
    public void deletePayment(Integer id) {
        if (!paymentRepository.existsById(id)) {
            throw new EntityNotFoundException("Payment not found with id " + id);
        }
        paymentRepository.deleteById(id);
    }


}