package com.PFE.stock.controllers;


import com.PFE.stock.entities.Combo;
import com.PFE.stock.services.Exceptions.ComboNotFoundException;
import com.PFE.stock.services.Exceptions.DuplicateComboException;
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


    @PostMapping("/add")
    public ResponseEntity<?> createCombo(@RequestBody Combo combo) {
        try {
            Combo createdCombo = comboService.createCombo(combo);
            return new ResponseEntity<>(createdCombo, HttpStatus.CREATED);
        } catch (DuplicateComboException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCombo(@PathVariable("id") Integer id, @RequestBody Combo combo) {
        try {
            Combo updatedCombo = comboService.updateCombo(id, combo);
            return new ResponseEntity<>(updatedCombo, HttpStatus.OK);
        } catch (ComboNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (DuplicateComboException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @GetMapping("/getBy/{id}")
    public ResponseEntity<?> getComboById(@PathVariable("id") Integer id) {
        try {
            Combo combo = comboService.getComboById(id);
            return new ResponseEntity<>(combo, HttpStatus.OK);
        } catch (ComboNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/GetALL/{establishmentId}")
    public ResponseEntity<?> getAllCombosByEstablishmentId(@PathVariable("establishmentId") Integer establishmentId) {
        List<Combo> combos = comboService.getAllCombosByEstablishmentId(establishmentId);
        return new ResponseEntity<>(combos, HttpStatus.OK);
    }


    @DeleteMapping("/combos/{id}")
    public ResponseEntity<Void> deleteCombo(@PathVariable("id") Integer id) {
        try {
            comboService.deleteCombo(id);
            return  ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (ComboNotFoundException e) {
            return  ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
