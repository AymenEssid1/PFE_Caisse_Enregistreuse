package com.PFE;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient

public class StockMS {
    public static void main(String[] args) {

        SpringApplication.run(StockMS.class,args);
    }
}