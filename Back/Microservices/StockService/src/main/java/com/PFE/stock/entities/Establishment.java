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
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private Image image;


    @JsonIgnore
    @OneToMany(mappedBy = "establishment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StockProduct> stockProducts;

    @JsonIgnore
    @OneToMany(mappedBy = "establishment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Category> categories;

    // TODO: 12/02/2024  parameters such as  private Bool Tips;

}
