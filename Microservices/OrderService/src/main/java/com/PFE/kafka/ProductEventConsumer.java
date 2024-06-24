package com.PFE.kafka;

import com.PFE.testingComm.Product;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;


import java.io.IOException;

@Service
public class ProductEventConsumer {

    @KafkaListener(topics = "product-events", groupId = "com.PFE")
    public void consume(String message) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Product product = objectMapper.readValue(message, Product.class);
        // Now you can use the 'product' object
        System.out.println("Consumed message: " + product);
    }
}