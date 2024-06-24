package com.PFE.kafka;

import com.PFE.testingComm.Product;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class ProductEventProducer {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    private static final String TOPIC = "response-product-events"; // Choose a suitable topic name

    public void sendResponseToProductEvent(String string) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String jsonProduct = objectMapper.writeValueAsString(string);
            kafkaTemplate.send(TOPIC, jsonProduct);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert product to JSON", e);
        }
    }



}
