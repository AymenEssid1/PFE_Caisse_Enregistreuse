package com.PFE.stock.entities;


import com.PFE.stock.entities.discount.Discount;
import com.PFE.stock.entities.image.Image;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "combo")
public class Combo {

    @Id
    @GeneratedValue
    private Integer id;


    private String ref;
    private String name;
    private float  price;
    private LocalDateTime createdAt;
    private boolean status;

    @ManyToMany
    @JoinTable(
            name = "combo_sold_products",
            joinColumns = @JoinColumn(name = "combo_id"),
            inverseJoinColumns = @JoinColumn(name = "sold_product_id")
    )
    private Set<SoldProduct> soldProducts;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "discount_id")
    private Discount discount;

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id", referencedColumnName = "id")
    private Image image;






}
