package com.PFE;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

@Controller
@EnableScheduling
public class WebSocketController {



    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendToClient(String message) {

        MessageWithUserDTO messageDTO = new MessageWithUserDTO();
        messageDTO.setContent(message);

        // Send the MessageWithUserDTO over the WebSocket
        messagingTemplate.convertAndSend("/topic/room/1", messageDTO);
    }






   /* // Method to be executed every 5 seconds
    @Scheduled(fixedDelay = 5000) // 5000 milliseconds = 5 seconds
   public void scheduledSendMessage() {
        String message = "Hello from the backend!"; // Modify the message as needed

        sendToClient(message);
        System.out.println("start");
    }
*/
}
