package com.PFE.stock.entities.discount;


import com.PFE.stock.entities.Combo;
import com.PFE.stock.entities.SoldProduct;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "discount")
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private float percentage;

    @Enumerated(EnumType.STRING)
    private DiscountType discountType;

    private String name;
    private Integer buyX;
    private Integer getY;
    private Date startTime;
    private Date endTime;



    @OneToMany(mappedBy = "discount", fetch = FetchType.EAGER)
    private List<SoldProduct> soldProducts;


    @OneToMany(mappedBy = "discount", fetch = FetchType.EAGER)
    private List<Combo> combos;


}
