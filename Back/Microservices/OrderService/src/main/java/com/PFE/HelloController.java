package com.PFE;

import com.PFE.kafka.ProductEventProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
public class HelloController {

    @Autowired
    ProductEventProducer producer;

    @GetMapping("sayhello")
    public String sayHello() {

       String message ="Hello, World from Order Service!";
        producer.sendResponseToProductEvent(message);
        return message;

    }
}
