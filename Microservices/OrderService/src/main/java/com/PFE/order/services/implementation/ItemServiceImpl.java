package com.PFE.order.services.implementation;

import com.PFE.order.entities.Item;
import com.PFE.order.repos.ItemRepository;
import com.PFE.order.services.service.ItemService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;


import com.fasterxml.jackson.core.type.TypeReference;


@Service
public class ItemServiceImpl implements ItemService{

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    private static final String SEND = "send";


    private static final String RECIEVE = "recieve";


    @Autowired
    private ItemRepository itemRepository;

    private CompletableFuture<Float> receivedNumberFuture = new CompletableFuture<>();



/*
    @Override
    public Item updateItem(Integer id, Item updatedItem) {
        // Check if the item with the given ID exists in the database
        Optional<Item> optionalItem = itemRepository.findById(id);
        if (optionalItem.isEmpty()) {
            throw new EntityNotFoundException("Item not found");
        }

        // Get the existing item from the optional
        Item existingItem = optionalItem.get();

        // Apply changes to the existing item
        existingItem.setQuantity(updatedItem.getQuantity());

        // Send the updated item details to calculate the price
        send(existingItem.getSoldProductId(), existingItem.getComboId(), existingItem.getQuantity());

        try {
            // Wait for the listener to receive the calculated price asynchronously
            Float receivedNumber = receivedNumberFuture.get();
            existingItem.setPrice(receivedNumber);
            receivedNumberFuture = new CompletableFuture<>();
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            System.out.println("Failed to get the received number: " + e.getMessage());
            // Handle the exception accordingly
        }

        // Save the updated item in the database
        return itemRepository.save(existingItem);
    }


    @Override
    public Item createItem(Item item) {
        try {
            // Save the item to the database

            send(item.getSoldProductId(), item.getComboId(), item.getQuantity());

            // Wait for the listener to receive the number
           // Integer receivedNumber = receivedNumberFuture.get();
            Float receivedNumber = receivedNumberFuture.get();


            item.setPrice(receivedNumber);
            receivedNumberFuture = new CompletableFuture<>();

            Item savedItem = itemRepository.save(item);

            return savedItem;
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            System.out.println("Failed to get the received number: " + e.getMessage());
            return null;
        }
    }

    public void send(Integer soldProductId, Integer comboId,int quantity) {
        try {
            // Construct the message as a JSON object
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> message = new HashMap<>();

            // Check if soldProductId is null and comboId has a value
            if (soldProductId == null && comboId != null) {
                message.put("comboId", comboId);
            } else if (comboId == null && soldProductId != null) {
                // Check if comboId is null and soldProductId has a value
                message.put("soldProductId", soldProductId);
            } else {
                System.out.println("Invalid combination of soldProductId and comboId.");
                return;
            }

            // Convert message to JSON
            message.put("quantity", quantity);
            String jsonMessage = objectMapper.writeValueAsString(message);

            // Send the JSON message
            kafkaTemplate.send(SEND, jsonMessage);
        } catch (JsonProcessingException e) {
            System.out.println("Failed to send message: " + e.getMessage());
        }
    }


    @KafkaListener(topics = "recieve", groupId = "com.PFE")
    public void listenDisplayMessage(String jsonMessage) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();

            // Parse the JSON response message
            Map<String, Object> responseMessage = objectMapper.readValue(jsonMessage, new TypeReference<Map<String, Object>>() {});

            // Extract the number from the response message as Float
            Float receivedNumber = ((Number) responseMessage.get("price")).floatValue();

            Float price = receivedNumber;

            // Set the received number to the CompletableFuture
            receivedNumberFuture.complete(price);

            // Print out the received number
            System.out.println("Received number from Discount microservice: " + receivedNumber);
        } catch (Exception e) {
            System.out.println("Failed to parse display message from Discount microservice: " + e.getMessage());
        }
    }

*/

    @Override
    public Item updateItem(Integer id, Item updatedItem) {
        Optional<Item> optionalItem = itemRepository.findById(id);
        if (optionalItem.isEmpty()) {
            throw new EntityNotFoundException("Item not found");
        }

        Item existingItem = optionalItem.get();
        existingItem.setQuantity(updatedItem.getQuantity());

        String requestId = UUID.randomUUID().toString();
        CompletableFuture<Float> future = new CompletableFuture<>();
        futureMap.put(requestId, future);

        send(existingItem.getSoldProductId(), existingItem.getComboId(), existingItem.getQuantity(), requestId);

        try {
            Float receivedNumber = future.get();
            existingItem.setPrice(receivedNumber);
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            System.out.println("Failed to get the received number: " + e.getMessage());
        } finally {
            futureMap.remove(requestId);
        }

        return itemRepository.save(existingItem);
    }

    private Map<String, CompletableFuture<Float>> futureMap = new ConcurrentHashMap<>();


    @Override
    public Item createItem(Item item) {
        String requestId = UUID.randomUUID().toString();
        CompletableFuture<Float> future = new CompletableFuture<>();
        futureMap.put(requestId, future);

        send(item.getSoldProductId(), item.getComboId(), item.getQuantity(), requestId);

        try {
            Float receivedNumber = future.get();
            item.setPrice(receivedNumber);
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            System.out.println("Failed to get the received number: " + e.getMessage());
        } finally {
            futureMap.remove(requestId);
        }

        return itemRepository.save(item);
    }

    public void send(Integer soldProductId, Integer comboId, int quantity, String requestId) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> message = new HashMap<>();

            if (soldProductId == null && comboId != null) {
                message.put("comboId", comboId);
            } else if (comboId == null && soldProductId != null) {
                message.put("soldProductId", soldProductId);
            } else {
                System.out.println("Invalid combination of soldProductId and comboId.");
                return;
            }

            message.put("quantity", quantity);
            message.put("requestId", requestId);
            String jsonMessage = objectMapper.writeValueAsString(message);

            kafkaTemplate.send(SEND, jsonMessage);
        } catch (JsonProcessingException e) {
            System.out.println("Failed to send message: " + e.getMessage());
        }
    }

    @KafkaListener(topics = RECIEVE, groupId = "com.PFE")
    public void listenDisplayMessage(String jsonMessage) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> responseMessage = objectMapper.readValue(jsonMessage, new TypeReference<Map<String, Object>>() {});

            String requestId = (String) responseMessage.get("requestId");
            Float receivedNumber = ((Number) responseMessage.get("price")).floatValue();

            CompletableFuture<Float> future = futureMap.get(requestId);
            if (future != null) {
                future.complete(receivedNumber);
            } else {
                System.out.println("No matching future found for requestId: " + requestId);
            }
        } catch (Exception e) {
            System.out.println("Failed to parse display message from Discount microservice: " + e.getMessage());
        }
    }



    @Override
    public Item getItemById(Integer id) {
        return itemRepository.findById(id).orElseThrow(()->new EntityNotFoundException("item not found"));
    }



    @Override
    public void deleteItem(Integer id) {
        itemRepository.deleteById(id);
    }

    @Override
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }


    @Override
    public void deleteAllItems() {
        itemRepository.deleteAll();
    }



    @Override
    @Transactional
    public void deleteItemsByIds(List<Integer> itemIds) {
        for (Integer itemId : itemIds) {
            itemRepository.findById(itemId)
                    .orElseThrow(() -> new EntityNotFoundException("Item not found with id: " + itemId));
        }
        itemRepository.deleteAllByIdIn(itemIds);
    }


}
