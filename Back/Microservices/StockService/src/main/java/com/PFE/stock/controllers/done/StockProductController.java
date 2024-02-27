package com.PFE.stock.controllers.done;


import com.PFE.stock.entities.StockProduct;
import com.PFE.stock.services.interfaces.done.StockProductService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stock-products")
public class StockProductController {

    private final StockProductService stockProductService;

    public StockProductController(StockProductService stockProductService) {
        this.stockProductService = stockProductService;
    }

    @PostMapping("/add-stock-product/{establishmentId}")
    public ResponseEntity<StockProduct> addStockProduct(
            @PathVariable("establishmentId") Integer establishmentId,
            @RequestBody StockProduct stockProduct
    ) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(stockProductService.addStockProduct(establishmentId, stockProduct));
        } catch (EntityExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/update-stock-product/{establishmentId}/{id}")
    public ResponseEntity<StockProduct> updateStockProduct(
            @PathVariable("establishmentId") Integer establishmentId,
            @PathVariable("id") Integer stockProductId,
            @RequestBody StockProduct updatedStockProduct
    ) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(stockProductService.updateStockProduct(establishmentId, stockProductId, updatedStockProduct));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (EntityExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @DeleteMapping("/delete-stock-product/{id}")
    public ResponseEntity<Void> deleteStockProduct(@PathVariable("id") Integer stockProductId) {
        try {
            stockProductService.deleteStockProduct(stockProductId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/get-all-stock-products/{establishmentId}")
    public ResponseEntity<List<StockProduct>> getAllStockProducts(@PathVariable("establishmentId") Integer establishmentId) {
        return ResponseEntity.status(HttpStatus.OK).body(stockProductService.getAllStockProducts(establishmentId));
    }
}
