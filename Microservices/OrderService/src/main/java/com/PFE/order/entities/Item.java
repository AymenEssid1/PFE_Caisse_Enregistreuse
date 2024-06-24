package com.PFE.order.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Item")
public class Item {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;

    private Integer soldProductId;

    private Integer comboId;

    private String name;
    private int quantity;

    private float price;

    @JsonIgnore
    @ManyToOne
    private Order order;


}
