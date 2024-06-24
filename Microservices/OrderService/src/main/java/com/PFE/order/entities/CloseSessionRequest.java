package com.PFE.order.entities;


import lombok.Data;

@Data
public class CloseSessionRequest {
    private float actualMoney;
    private String note;


}

