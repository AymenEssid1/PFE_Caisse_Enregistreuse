package com.PFE.stock.repos;

import com.PFE.stock.entities.Establishment;
import com.PFE.stock.entities.SoldProduct;
import com.PFE.stock.entities.StockProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SoldProductRepository extends JpaRepository<SoldProduct, Integer> {
    Optional<SoldProduct> findByRefAndCategoryEstablishment(String ref, Establishment establishment);
    Optional<SoldProduct> findByNameAndCategoryEstablishment(String name, Establishment establishment);
    List<SoldProduct> findAllByCategoryEstablishment(Establishment establishment);



    Optional<SoldProduct> findByRefAndCategoryEstablishmentId(String ref,Integer establishmentId);


    @Query("SELECT sp FROM SoldProduct sp LEFT JOIN FETCH sp.stockEquivalents WHERE sp.id = :id")
    Optional<SoldProduct> findByIdWithStockEquivalents(@Param("id") Integer id);


    @Query("SELECT sp FROM SoldProduct sp WHERE sp.id IN :ids")
    List<SoldProduct> findByIds(@Param("ids") List<Integer> ids);

    List<SoldProduct> findByStockEquivalents_Id(Integer stockEquivalentId);

}
