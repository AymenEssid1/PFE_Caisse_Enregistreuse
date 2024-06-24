package com.PFE.payment.entities;


import lombok.Data;

@Data
public class PaymentApiRequestDto {
    private int amount;
    //private int currency;
    //private String language;
    private String orderNumber;
    //private String password;
    private String returnUrl;
    private String failUrl;
   //private String userName;
}

