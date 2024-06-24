package com.PFE.stock.repos;

import com.PFE.stock.entities.Category;
import com.PFE.stock.entities.Establishment;
import com.PFE.stock.entities.StockProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findByCategoryNameAndEstablishment(String categoryName, Establishment establishment);
    List<Category> findByEstablishment(Establishment establishment);
}


