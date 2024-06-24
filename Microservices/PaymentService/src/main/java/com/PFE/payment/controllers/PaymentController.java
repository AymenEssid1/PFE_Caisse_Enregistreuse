package com.PFE.payment.controllers;

import com.PFE.payment.entities.OrderStatusRequestDto;
import com.PFE.payment.entities.Payment;
import com.PFE.payment.entities.PaymentApiRequestDto;
import com.PFE.payment.entities.PaymentRequestDto;
import com.PFE.payment.services.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestTemplate;


@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;


    @PostMapping("/create")
    public ResponseEntity<Payment> createPayment(@RequestBody PaymentRequestDto paymentRequest) {

        try {
            Payment payment = paymentService.createPayment(paymentRequest);
            return ResponseEntity.ok(payment);
        }catch (EntityNotFoundException ex ){
            return ResponseEntity.notFound().build();
        }

    }

    @GetMapping("/getAll")
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/getby/{id}")
    public Payment getPaymentById(@PathVariable("id") Integer id) {
        try {
            return paymentService.getPaymentById(id);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public void deletePayment(@PathVariable("id") Integer id) {
        try {
            paymentService.deletePayment(id);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }


    @Autowired
    private RestTemplate restTemplate;

    @Value("${clictopay.url}")
    private String clictopayUrl;



    @PostMapping("/externalPayment")
    public String externalPayment(@RequestBody PaymentApiRequestDto paymentApiRequest) {
        String url = String.format(
                "%s?amount=%d&currency=%d&language=%s&orderNumber=%s&password=%s&returnUrl=%s&failUrl=%s&userName=%s",
                clictopayUrl,
                paymentApiRequest.getAmount()*1000,
                788,
                "fr",
                paymentApiRequest.getOrderNumber(),
                "7d57mkST",
                paymentApiRequest.getReturnUrl(),
                paymentApiRequest.getFailUrl(),
                "0799902051"
        );

        ResponseEntity<String> response = restTemplate.postForEntity(url, null, String.class);

        return response.getBody();
    }


    @PostMapping("/clickToPayCheck")
    public String getOrderStatus(@RequestBody OrderStatusRequestDto orderStatusRequest) {
        String url = String.format(
                "https://test.clictopay.com/payment/rest/getOrderStatus.do?language=en&orderId=%s&password=%s&userName=%s",
                orderStatusRequest.getOrderId(),
                "7d57mkST",
                "0799902051"
        );

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);



        return response.getBody();
    }


}

