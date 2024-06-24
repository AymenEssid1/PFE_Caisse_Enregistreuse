package com.PFE.notification;

import com.PFE.notification.NotificationEntity;
import com.PFE.notification.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/notification")
public class NotificationControllers {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/all")
    public ResponseEntity<List<NotificationEntity>> getAllNotifications() {
        List<NotificationEntity> notifications = notificationRepository.findAll();
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/establishment/{id}")
    public ResponseEntity<List<NotificationEntity>> getNotificationsByEstablishmentId(@PathVariable("id") Integer id) {
        List<NotificationEntity> notifications = notificationRepository.findByEstablishmentId(id);
        return ResponseEntity.ok(notifications);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotificationById(@PathVariable("id") Integer id) {
        notificationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAllNotifications() {
        notificationRepository.deleteAll();
        return ResponseEntity.noContent().build();
    }
}
