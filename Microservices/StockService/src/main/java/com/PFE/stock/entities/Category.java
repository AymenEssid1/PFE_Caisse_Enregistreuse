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
@Table(name = "category")
public class Category {


    @Id
    @GeneratedValue
    private Integer id;
    private String categoryName;

    @ManyToOne
    @JoinColumn(name = "establishment_id")
    private Establishment establishment;

    @JsonIgnore
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SoldProduct> soldProducts;
}
