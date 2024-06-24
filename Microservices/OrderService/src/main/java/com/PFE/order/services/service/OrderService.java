package com.PFE.order.services.service;

import com.PFE.order.entities.Order;

import java.util.List;

public interface OrderService {


    Order createOrder(Order order,Integer sessionId);
    Order getOrderById(Integer id);
    List<Order> getAllOrders();
    void deleteOrder(Integer id);

    void deleteAllOrders();  // New method to delete all orders

     Order updateOrderStatus(Integer orderId, boolean paymentStatus);

    public List<Order> getPaidOrdersBySessionId(Integer sessionId);





}
