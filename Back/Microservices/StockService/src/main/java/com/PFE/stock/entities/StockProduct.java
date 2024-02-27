package com.PFE.stock.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "stockproduct")

public class StockProduct {


    @Id
    @GeneratedValue
    private Integer id;

    private String refstock;
    private String name;
    private float  quantity;



    @ManyToOne
    @JoinColumn(name = "establishment_id")
    private Establishment establishment;




}
