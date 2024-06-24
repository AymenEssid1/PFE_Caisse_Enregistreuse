package com.PFE.payment.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Client")
public class Client {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;


    private String email;
    private String firstname;
    private String lastname;
    private String phone;
    private float fidelityPoints;
    private Integer establishmentId;

    @OneToMany(mappedBy = "client")
    private List<Payment> payment;




}
