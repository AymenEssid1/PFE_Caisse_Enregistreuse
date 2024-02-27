package com.PFE.stock.repos;

import com.PFE.stock.entities.Establishment;
import com.PFE.stock.entities.SoldProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SoldProductRepository extends JpaRepository<SoldProduct, Integer> {
    Optional<SoldProduct> findByRefAndCategoryEstablishment(String ref, Establishment establishment);
    Optional<SoldProduct> findByNameAndCategoryEstablishment(String name, Establishment establishment);
    List<SoldProduct> findAllByCategoryEstablishment(Establishment establishment);
}
