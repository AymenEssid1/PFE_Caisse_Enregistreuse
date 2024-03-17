package com.PFE.stock.repos;

import com.PFE.stock.entities.Combo;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ComboRepository extends JpaRepository<Combo, Integer> {

    @EntityGraph(attributePaths = "soldProducts")
    @Query("SELECT c FROM Combo c WHERE c.id = :comboId")
    Optional<Combo> findByIdWithSoldProducts(@Param("comboId") Integer comboId);
}
