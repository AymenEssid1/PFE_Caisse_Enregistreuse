package
        com.PFE.stock.entities;


import com.PFE.stock.entities.image.Image;
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
@Table(name = "establishment")
public class Establishment {

    @Id
    @GeneratedValue
    private Integer id;
    private String name;

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id", referencedColumnName = "id")
    private Image image;



    @JsonIgnore
    @OneToMany(mappedBy = "establishment", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.EAGER)
    private List<StockProduct> stockProducts;

    @JsonIgnore
    @OneToMany(mappedBy = "establishment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Category> categories;



    @OneToMany(mappedBy = "establishment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tables> tables;




    private boolean tableSystem;

    private boolean scanSystem;

    private boolean fidelitySystem;

    private float fidelityRatio; //dinar to points

    private float cashOutRatio; //points to dinar





}
