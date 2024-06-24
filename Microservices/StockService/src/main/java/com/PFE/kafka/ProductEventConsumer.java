package com.PFE.kafka;

import com.PFE.testingComm.Product;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ProductEventConsumer {

    @KafkaListener(topics = "response-product-events", groupId = "com.PFE")
    public void consume(String message) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        String string = objectMapper.readValue(message, String.class);
        // Now you can use the 'product' object
        System.out.println("Consumed message: " + string);
    }
}