package com.PFE.notification;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "notification")
public class NotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer establishmentId;
    private String establishmentName;
    private String lowStockProducts;

    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;

    // Constructors, getters, and setters
}
