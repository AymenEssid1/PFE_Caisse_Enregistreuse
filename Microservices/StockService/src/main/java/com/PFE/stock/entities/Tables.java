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
@Table(name = "tables")
public class Tables {


    @Id
    @GeneratedValue
    private Integer id;
    private String name;
    private Boolean status;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "establishment_id")
    private Establishment establishment;
}
