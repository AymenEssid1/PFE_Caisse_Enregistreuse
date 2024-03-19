package com.PFE.stock.entities;


import com.PFE.stock.entities.image.Image;
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
    @GeneratedValue
    private Integer id;


    private String ref;
    private String name;
    private float  price;

    private LocalDateTime createdAt;

    private boolean status;

   /* @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private Image image;*/



    @ManyToOne
    @JoinColumn(name= "category_id")
    private Category category;


    @OneToMany(mappedBy = "soldProduct", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StockEquivalent> stockEquivalents;




}
