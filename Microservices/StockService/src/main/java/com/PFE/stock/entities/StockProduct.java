package com.PFE.stock.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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

    private Unit unit;

    private float lowStockAlert;



    @ManyToOne
    @JoinColumn(name = "establishment_id")
    private Establishment establishment;


    @JsonIgnore
    @OneToMany(mappedBy = "stockproduct", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StockEquivalent> stockEquivalents;


}
