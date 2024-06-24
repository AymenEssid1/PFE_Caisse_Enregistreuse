package com.PFE.stock.controllers;


import com.PFE.stock.entities.discount.Discount;
import com.PFE.stock.services.Exceptions.ComboNotFoundException;
import com.PFE.stock.services.interfaces.DiscountService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/discount")
public class DiscountController {

    @Autowired
    private DiscountService discountService;




    @GetMapping("getBy/{discountid}")
    public ResponseEntity<?> getDiscountById(@PathVariable("discountid") Integer id) {

        try{

            Discount discount = discountService.getDiscountById(id);
            return new ResponseEntity<>(discount, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> createDiscount(@RequestBody Discount discount) {
        try {
            Discount createdDiscount = discountService.createDiscount(discount);
            return new ResponseEntity<>(createdDiscount, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{discountid}")
    public ResponseEntity<?> updateDiscount(@PathVariable("discountid") Integer id, @RequestBody Discount discount) {
        try {
            Discount updatedDiscount = discountService.updateDiscount(id, discount);
            return new ResponseEntity<>(updatedDiscount, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }



    @DeleteMapping("/deleteByid/{discountId}")
    public ResponseEntity<Void> deleteDiscountById(@PathVariable("discountId") Integer discountId) {
        discountService.deleteById(discountId);
        return ResponseEntity.noContent().build();
    }



    @GetMapping("/by-establishment/{establishmentId}")
    public ResponseEntity<List<Discount>> getDiscountsByEstablishmentId(@PathVariable("establishmentId") Integer establishmentId) {
        List<Discount> discounts = discountService.getAllDiscountsByEstablishmentId(establishmentId);
        if (discounts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(discounts);
    }


    @GetMapping("/getAll")
    public ResponseEntity<List<Discount>> getAllDiscounts() {
        List<Discount> discounts = discountService.getAllDiscounts();
        return new ResponseEntity<>(discounts, HttpStatus.OK);
    }


    @DeleteMapping("/delete-all")
    public ResponseEntity<Void> deleteAllDiscounts() {
        discountService.deleteAll();
        return ResponseEntity.noContent().build();
    }



}
