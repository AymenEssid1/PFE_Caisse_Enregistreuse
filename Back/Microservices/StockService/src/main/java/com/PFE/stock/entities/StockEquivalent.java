package com.PFE.stock.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "stockEquivalent")
public class StockEquivalent {

    @Id
    @GeneratedValue
    private Integer id;

    private float quantity;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "sold_product_id")
    private SoldProduct soldProduct;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private StockProduct stockproduct;

}
