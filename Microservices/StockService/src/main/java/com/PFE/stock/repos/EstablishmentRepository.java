package com.PFE.stock.repos;

import com.PFE.stock.entities.Establishment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstablishmentRepository extends JpaRepository<Establishment, Integer> {
    Optional<Establishment> findByName(String name);
}