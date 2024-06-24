package com.PFE.stock.services.interfaces;

import com.PFE.stock.entities.discount.Discount;

import java.util.List;

public interface DiscountService {

    List<Discount> getAllDiscounts();
    Discount getDiscountById(Integer id);
    Discount createDiscount(Discount discount);
    Discount updateDiscount(Integer id, Discount discount);

    void deleteById(Integer discountId);

    void deleteAll();

    List<Discount> getAllDiscountsByEstablishmentId(Integer establishmentId);
}
