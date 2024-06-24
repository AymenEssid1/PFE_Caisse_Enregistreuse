package com.PFE.stock.services.interfaces;

import com.PFE.stock.entities.Combo;
import com.PFE.stock.entities.SoldProduct;

import java.util.List;

public interface StatisticsService {


    List<SoldProduct> getSoldProductsByIds(List<Integer> ids);
    List<Combo> getCombosByIds(List<Integer> ids);
}
