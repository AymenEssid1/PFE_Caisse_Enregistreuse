package com.PFE.stock.repos;

import com.PFE.stock.entities.Tables;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TablesRepository extends JpaRepository<Tables,Integer> {
    List<Tables> findByEstablishmentId(Integer establishmentId);

}
