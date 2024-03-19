package com.PFE.stock.repos;

import com.PFE.stock.entities.Combo;
import com.PFE.stock.entities.SoldProduct;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ComboRepository extends JpaRepository<Combo, Integer> {

    Combo findByRef(String ref);
    Combo findByName(String name);
    @Query("SELECT c FROM Combo c JOIN c.soldProducts s WHERE s = :soldProduct")
    List<Combo> findBySoldProduct(@Param("soldProduct") SoldProduct soldProduct);
}
