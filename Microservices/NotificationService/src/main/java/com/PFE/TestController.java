package com.PFE;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello!";
    }


    @Autowired
    private SimpMessagingTemplate messagingTemplate;



    @GetMapping("/sendNotification")
    public String sendNotification() {
        messagingTemplate.convertAndSend("/topic/messages", "Hello from the backend!");
        return "Notification sent!";
    }
}
