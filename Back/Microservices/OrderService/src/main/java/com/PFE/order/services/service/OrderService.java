package com.PFE.order.services.service;

import com.PFE.order.entities.Order;

import java.util.List;

public interface OrderService {


    Order createOrder(Order order);
    Order getOrderById(Integer id);
    List<Order> getAllOrders();
    void deleteOrder(Integer id);
}
