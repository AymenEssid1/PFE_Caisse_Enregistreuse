package com.PFE.kafka;

import com.PFE.notification.NotificationEntity;
import com.PFE.notification.NotificationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import com.fasterxml.jackson.core.type.TypeReference;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;



    @Service
    public class KafkaListenerService {

        @Autowired
        private SimpMessagingTemplate messagingTemplate;

        @Autowired
        private NotificationRepository notificationRepository;

        @KafkaListener(topics = "notification", groupId = "com.PFE")
        public void listenStockReductionMessage(String jsonMessage) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> message = objectMapper.readValue(jsonMessage, new TypeReference<Map<String, Object>>() {});

                String requestId = (String) message.get("requestId");
                Integer establishmentId = (Integer) message.get("establishmentId");
                String establishmentName = (String) message.get("establishmentName");
                List<String> lowStockProducts = (List<String>) message.get("lowStockProducts");



                // Save notification to the database
                String productsAsString = String.join(",", lowStockProducts); // Convert list to comma-separated string
                NotificationEntity notification = new NotificationEntity();
                notification.setEstablishmentId(establishmentId);
                notification.setEstablishmentName(establishmentName);
                notification.setLowStockProducts(productsAsString);
                notification.setTimestamp(new Date()); // Set current timestamp

                notificationRepository.save(notification);

                // Send message to WebSocket
                messagingTemplate.convertAndSend("/topic/room/1", notification);

            } catch (Exception e) {
                System.out.println("Failed to process stock reduction message: " + e.getMessage());
            }
        }
    }



