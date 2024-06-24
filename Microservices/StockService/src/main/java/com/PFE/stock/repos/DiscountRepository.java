package com.PFE.stock.repos;

import com.PFE.stock.entities.Establishment;
import com.PFE.stock.entities.SoldProduct;
import com.PFE.stock.entities.discount.Discount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DiscountRepository extends JpaRepository<Discount, Integer> {

    Optional<Discount> findBySoldProductsId(Integer soldProductId);

    // Find discount by comboId
    Optional<Discount> findByCombosId(Integer comboId);

}
