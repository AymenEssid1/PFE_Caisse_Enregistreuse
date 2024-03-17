package com.PFE.stock.controllers;

import com.PFE.stock.entities.StockEquivalent;
import com.PFE.stock.services.interfaces.SoldProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stock-equivalents")
public class StockEquivalentController {

    @Autowired
    private SoldProductService stockEquivalentService;

    @GetMapping
    public ResponseEntity<List<StockEquivalent>> getAllStockEquivalents() {
        List<StockEquivalent> stockEquivalents = stockEquivalentService.getAllStockEquivalents();
        return ResponseEntity.ok(stockEquivalents);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockEquivalent> getStockEquivalentById(@PathVariable Integer id) {
        Optional<StockEquivalent> stockEquivalent = stockEquivalentService.getStockEquivalentById(id);
        return stockEquivalent.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStockEquivalentById(@PathVariable Integer id) {
        stockEquivalentService.deleteStockEquivalentById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete-all")
    public ResponseEntity<Void> deleteAllStockEquivalents() {
        stockEquivalentService.deleteAllStockEquivalents();
        return ResponseEntity.noContent().build();
    }
}
