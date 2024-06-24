package com.PFE.stock.services.implementation.done;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemDTO {

    private Integer id;
    private Integer soldProductId;
    private Integer comboId;
    private String name;
    private int quantity;
    private float price;
}
