package com.PFE.stock.controllers;


import com.PFE.stock.entities.Combo;
import com.PFE.stock.entities.SoldProduct;
import com.PFE.stock.services.interfaces.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/stats")
public class StatsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/sold-products")
    public ResponseEntity<List<SoldProduct>> getSoldProductsByIds(@RequestParam("list") List<Integer> ids) {
        List<SoldProduct> soldProducts = statisticsService.getSoldProductsByIds(ids);
        return ResponseEntity.ok(soldProducts);
    }

    @GetMapping("/combos")
    public ResponseEntity<List<Combo>> getCombosByIds(@RequestParam("list") List<Integer> ids) {
        List<Combo> combos = statisticsService.getCombosByIds(ids);
        return ResponseEntity.ok(combos);
    }
}
