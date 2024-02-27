package com.PFE.stock.services.implementation;

import com.PFE.stock.repos.DiscountRepository;
import com.PFE.stock.services.interfaces.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class DiscountServiceImpl implements DiscountService {

    @Autowired
    private DiscountRepository discountrepo;
}
