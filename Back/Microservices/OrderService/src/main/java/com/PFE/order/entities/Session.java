package com.PFE.order.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "Session")
public class Session {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;


    private Integer cashierId;


    private boolean  status; // open or closed

    private LocalDateTime startTime;

    private LocalDateTime closeTime;



    private float startMoney;
    private float expectedMoney;
    private float actualMoney;

    @OneToMany(mappedBy = "session", cascade = {CascadeType.MERGE, CascadeType.PERSIST}, orphanRemoval = true)
    private List<Order> orders;



}
