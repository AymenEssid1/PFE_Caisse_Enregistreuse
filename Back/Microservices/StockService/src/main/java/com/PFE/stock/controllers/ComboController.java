package com.PFE.stock.controllers;


import com.PFE.stock.entities.Combo;
import com.PFE.stock.services.interfaces.ComboService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/combo")
public class ComboController {

    @Autowired
    private ComboService comboService;

    @PostMapping("/add-combo/{establishmentId}")
    public ResponseEntity<Combo> addCombo(
            @PathVariable("establishmentId") Integer establishmentId,
            @RequestBody Combo combo
    ) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(comboService.addCombo(establishmentId, combo));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

 /*   @PutMapping("/update-combo/{establishmentId}/{comboId}")
    public ResponseEntity<Combo> updateCombo(
            @PathVariable("establishmentId") Integer establishmentId,
            @PathVariable("comboId") Integer comboId,
            @RequestBody Combo updatedCombo
    ) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(comboService.updateCombo(establishmentId, comboId, updatedCombo));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }*/

    @DeleteMapping("/delete-combo/{comboId}")
    public ResponseEntity<Void> deleteCombo(
            @PathVariable("comboId") Integer comboId
    ) {
        comboService.deleteCombo(comboId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/get-all-combos/{establishmentId}")
    public ResponseEntity<List<Combo>> getAllCombos(
            @PathVariable("establishmentId") Integer establishmentId
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(comboService.getAllCombos(establishmentId));
    }

    @GetMapping("/get-combo/{comboId}")
    public ResponseEntity<Combo> getComboById(
            @PathVariable("comboId") Integer comboId
    ) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(comboService.getComboById(comboId));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
