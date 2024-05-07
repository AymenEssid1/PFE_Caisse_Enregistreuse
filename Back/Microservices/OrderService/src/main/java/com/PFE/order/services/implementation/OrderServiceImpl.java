package com.PFE.order.services.implementation;

import com.PFE.order.entities.Item;
import com.PFE.order.entities.Order;
import com.PFE.order.repos.OrderRepository;
import com.PFE.order.services.service.OrderService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;



    @Override
    public Order createOrder(Order order) {


        if (order.getItems() != null) {
            // Step 6: Iterate through stockEquivalents and set associations
            for (Item item : order.getItems()) {

                item.setOrder(order);  // Associate with the unsaved soldProduct
            }
        }


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
}
