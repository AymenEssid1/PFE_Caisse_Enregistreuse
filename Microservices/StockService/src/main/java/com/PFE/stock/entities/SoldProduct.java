package com.PFE.stock.entities;


import com.PFE.stock.entities.discount.Discount;
import com.PFE.stock.entities.image.Image;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
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
@Table(name = "soldproduct")
public class SoldProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    private String ref;
    private String name;
    private float  price;

    private LocalDateTime createdAt;

    private boolean status;

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id", referencedColumnName = "id")
    private Image image;



    @ManyToOne
    @JoinColumn(name= "category_id")
    private Category category;


    @OneToMany(mappedBy = "soldProduct", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StockEquivalent> stockEquivalents;


////////////////////////////////////////////////////
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "discount_id")
    private Discount discount;



}
