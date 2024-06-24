package com.PFE.order.services.implementation;

import com.PFE.order.entities.Item;
import com.PFE.order.entities.Order;
import com.PFE.order.entities.Session;
import com.PFE.order.repos.ItemRepository;
import com.PFE.order.repos.OrderRepository;
import com.PFE.order.repos.SessionRepository;
import com.PFE.order.services.service.OrderService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;


@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private SessionRepository sessionRepository;






    @Override
    public Order createOrder(Order order,Integer sessionId) {

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Session not found"));
        List<Item> associatedItems = new ArrayList<>();
        if (order.getItems() != null) {
            for (Item item : order.getItems()) {

                Item existingItem = itemRepository.findById(item.getId()).orElseThrow(()->new EntityNotFoundException());

                if (existingItem != null) {

                    existingItem.setOrder(order);
                    // Add the existing item to the list of associated items
                    associatedItems.add(existingItem);
                }
            }
        }
        order.setItems(associatedItems);

        order.setSession(session);

        order.setCreatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }




    @Override
    public Order getOrderById(Integer id) {
        return orderRepository.findById(id).orElse(null);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public void deleteOrder(Integer id) {
        orderRepository.deleteById(id);
    }


    @Override
    public void deleteAllOrders() {
        orderRepository.deleteAll();
    }


    @Override
    public List<Order> getPaidOrdersBySessionId(Integer sessionId) {
        return orderRepository.findPaidOrdersBySessionId(sessionId);
    }


    @Override
    public Order updateOrderStatus(Integer orderId, boolean paymentStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        order.setPaymentStatus(paymentStatus);

        sendOrderItemsToStockReduction(order);
        return orderRepository.save(order);
    }



    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    private static final String STOCK = "stockreduction";

    public void sendOrderItemsToStockReduction(Order order) {


        String requestId = UUID.randomUUID().toString();

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> message = new HashMap<>();
            message.put("requestId", requestId);
            message.put("orderItems", order.getItems());

            String jsonMessage = objectMapper.writeValueAsString(message);

            kafkaTemplate.send(STOCK, jsonMessage);
        } catch (JsonProcessingException e) {
            System.out.println("Failed to send message: " + e.getMessage());
        }
    }
}
