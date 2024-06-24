package com.PFE.order.controllers;


import com.PFE.order.entities.Item;
import com.PFE.order.entities.Order;
import com.PFE.order.entities.Session;
import com.PFE.order.services.service.OrderService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderService orderService;


    @PostMapping("/add/{sessionId}")
    public ResponseEntity<?>  createOrder(@RequestBody Order order,@PathVariable("sessionId") Integer sessionId) {

        try{
            Order newOrder = orderService.createOrder(order,sessionId);


            return new ResponseEntity<>(newOrder, HttpStatus.OK);
        } catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping("/getby/{id}")
    public Order getOrderById(@PathVariable("id") Integer id) {
        return orderService.getOrderById(id);
    }

    @GetMapping("/getAll")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteOrder(@PathVariable("id") Integer id) {
        orderService.deleteOrder(id);
    }


    @DeleteMapping("/deleteAll")
    public ResponseEntity<?> deleteAllOrders() {
        try {
            orderService.deleteAllOrders();
            return new ResponseEntity<>("All orders have been deleted", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable("orderId") Integer orderId,
                                               @RequestBody boolean paymentStatus) {
        try {
            Order updatedOrder = orderService.updateOrderStatus(orderId, paymentStatus);
            return ResponseEntity.ok(updatedOrder);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating order status");
        }
    }


    @GetMapping("/{sessionId}/notPaid")
    public ResponseEntity<List<Order>> getPaidOrdersBySessionId(@PathVariable("sessionId") Integer sessionId) {
        List<Order> paidOrders = orderService.getPaidOrdersBySessionId(sessionId);
        return ResponseEntity.ok(paidOrders);
    }
}
