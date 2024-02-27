package com.PFE.stock.entities.discount;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "discount")
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double percentage;

    @Enumerated(EnumType.STRING)
    private DiscountType discountType;


    private Integer buyX;
    private Integer getY;


    private LocalDateTime startTime;
    private LocalDateTime endTime;




}
