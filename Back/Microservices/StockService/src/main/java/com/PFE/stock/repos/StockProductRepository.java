package com.PFE.stock.repos;

import com.PFE.stock.entities.Establishment;
import com.PFE.stock.entities.StockProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StockProductRepository extends JpaRepository<StockProduct, Integer> {
    Optional<StockProduct> findByNameAndEstablishment(String name, Establishment establishment);
    Optional<StockProduct> findByRefstockAndEstablishment(String refstock, Establishment establishment);


    List<StockProduct> findByEstablishment(Establishment establishment);

}