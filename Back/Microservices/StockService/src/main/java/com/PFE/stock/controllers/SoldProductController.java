package com.PFE.stock.controllers;


import com.PFE.stock.entities.SoldProduct;
import com.PFE.stock.entities.StockEquivalent;
import com.PFE.stock.services.interfaces.SoldProductService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sold-products")
public class SoldProductController {

    private final SoldProductService soldProductService;

    public SoldProductController(SoldProductService soldProductService) {
        this.soldProductService = soldProductService;
    }

    @PostMapping("/add-sold-product/{establishmentId}")
    public ResponseEntity<SoldProduct> addSoldProduct(
            @PathVariable("establishmentId") Integer establishmentId,
            @RequestBody SoldProduct soldProduct
    ) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(soldProductService.addSoldProduct(establishmentId, soldProduct));
        } catch (EntityExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/update-sold-product/{id}/{establishmentId}")
    public ResponseEntity<Object> updateSoldProduct(
            @PathVariable("id") Integer soldProductId,
            @PathVariable("establishmentId") Integer establishmentId,
            @RequestBody SoldProduct updatedSoldProduct
    ) {
        try {
            SoldProduct result = soldProductService.updateSoldProduct(establishmentId,soldProductId, updatedSoldProduct);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sold Product not found");
        } catch (EntityExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Another sold product with the same name or ref already exists in the same establishment");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }


    @DeleteMapping("/delete-sold-product/{id}")
    public ResponseEntity<Void> deleteSoldProduct(@PathVariable("id") Integer soldProductId) {
        try {
            soldProductService.deleteSoldProduct(soldProductId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/get-all-sold-products/{establishmentId}")
    public ResponseEntity<List<SoldProduct>> getAllSoldProducts(@PathVariable("establishmentId") Integer establishmentId) {
        return ResponseEntity.status(HttpStatus.OK).body(soldProductService.getAllSoldProducts(establishmentId));
    }
}
