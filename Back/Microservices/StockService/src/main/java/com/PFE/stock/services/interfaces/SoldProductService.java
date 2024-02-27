package com.PFE.stock.services.interfaces;

import com.PFE.stock.entities.SoldProduct;
import com.PFE.stock.entities.StockEquivalent;

import java.util.List;

public interface SoldProductService {
    SoldProduct addSoldProduct(Integer establishmentId, SoldProduct soldProduct);
    SoldProduct updateSoldProduct(Integer establishmentId, Integer soldProductId, SoldProduct updatedSoldProduct);
    void deleteSoldProduct(Integer soldProductId);
    List<SoldProduct> getAllSoldProducts(Integer establishmentId);
}

