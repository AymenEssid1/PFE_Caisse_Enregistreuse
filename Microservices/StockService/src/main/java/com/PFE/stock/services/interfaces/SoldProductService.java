package com.PFE.stock.services.interfaces;

import com.PFE.stock.entities.SoldProduct;
import com.PFE.stock.entities.StockEquivalent;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface SoldProductService {
    SoldProduct addSoldProduct(Integer establishmentId, SoldProduct soldProduct);
    SoldProduct updateSoldProduct(Integer establishmentId, Integer soldProductId, SoldProduct updatedSoldProduct);
    void deleteSoldProduct(Integer soldProductId);
    List<SoldProduct> getAllSoldProducts(Integer establishmentId);

    //////////////

    List<StockEquivalent> getAllStockEquivalents();

    Optional<StockEquivalent> getStockEquivalentById(Integer id);

    void deleteStockEquivalentById(Integer id);

    void deleteAllStockEquivalents();

    SoldProduct getById(Integer id);


    SoldProduct findByRef(String ref,Integer establishmentId);
    Page<SoldProduct> getAllSoldProducts2(Integer establishmentId, int page, int size);

}

