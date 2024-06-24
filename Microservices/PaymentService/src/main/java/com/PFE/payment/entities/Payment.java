package com.PFE.payment.entities;
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
@Table(name = "Payment")
public class Payment {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;


    private LocalDateTime paymentDate;
    @Enumerated(EnumType.STRING)

    private PayType payType;
    private boolean Status;
    private Integer orderId;
    private Integer establishmentId;
    private float paidAmount;

    @JsonIgnore
    @ManyToOne
    private Client client;

}


