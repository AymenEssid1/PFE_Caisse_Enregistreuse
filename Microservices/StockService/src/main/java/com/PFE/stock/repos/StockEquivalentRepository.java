package com.PFE.stock.repos;

import com.PFE.stock.entities.StockEquivalent;
import com.PFE.stock.entities.StockProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockEquivalentRepository extends JpaRepository<StockEquivalent,Integer> {

    List<StockEquivalent> findByStockproduct(StockProduct stockProduct);
}
