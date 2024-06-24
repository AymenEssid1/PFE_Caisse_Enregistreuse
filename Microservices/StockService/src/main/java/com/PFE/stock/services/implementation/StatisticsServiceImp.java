package com.PFE.stock.services.implementation;

import com.PFE.stock.entities.Combo;
import com.PFE.stock.entities.SoldProduct;
import com.PFE.stock.repos.ComboRepository;
import com.PFE.stock.repos.SoldProductRepository;
import com.PFE.stock.services.interfaces.StatisticsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Slf4j
@Service
public class StatisticsServiceImp implements StatisticsService {

    @Autowired
    private SoldProductRepository soldProductRepository;

    @Autowired
    private ComboRepository comboRepository;

    @Override
    public List<SoldProduct> getSoldProductsByIds(List<Integer> ids) {
        return soldProductRepository.findByIds(ids);
    }

    @Override
    public List<Combo> getCombosByIds(List<Integer> ids) {
        return comboRepository.findByIds(ids);
    }
}
