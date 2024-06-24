package com.PFE.notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationEntity,Integer> {


    List<NotificationEntity> findByEstablishmentId(Integer establishmentId);

}
