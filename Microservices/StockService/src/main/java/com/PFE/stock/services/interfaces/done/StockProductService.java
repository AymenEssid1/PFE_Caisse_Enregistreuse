package com.PFE.stock.services.interfaces.done;

import com.PFE.stock.entities.StockEquivalent;
import com.PFE.stock.entities.StockProduct;

import java.util.List;

public interface StockProductService {
    StockProduct addStockProduct(Integer establishmentId, StockProduct stockProduct);
    StockProduct updateStockProduct(Integer establishmentId, Integer stockProductId, StockProduct updatedStockProduct);
    void deleteStockProduct(Integer stockProductId);
    List<StockProduct> getAllStockProducts(Integer establishmentId);
    StockProduct getById(Integer stockpid);



    boolean checkStockAvailability(List<StockEquivalent> stockEquivalents, float quantity);

}

