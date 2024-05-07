package com.PFE.stock.controllers;


import com.PFE.stock.entities.Combo;
import com.PFE.stock.entities.Establishment;
import com.PFE.stock.entities.SoldProduct;
import com.PFE.stock.entities.image.IFileLocationService;
import com.PFE.stock.entities.image.Image;
import com.PFE.stock.repos.ComboRepository;
import com.PFE.stock.services.Exceptions.ComboNotFoundException;
import com.PFE.stock.services.Exceptions.DuplicateComboException;
import com.PFE.stock.services.interfaces.ComboService;
import com.PFE.stock.services.interfaces.SoldProductService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/combo")
public class ComboController {

    @Autowired
    private ComboService comboService;

    private final IFileLocationService fileLocationService;


    @Autowired
    private ComboRepository comboRepository;
    public ComboController( IFileLocationService fileLocationService) {
        this.fileLocationService = fileLocationService;

    }


    @PostMapping(value = "/addImagetoEstab/{comboId}", consumes = "multipart/form-data")   //use @modelattribute maybe
    public ResponseEntity<Combo> addImagetoEstab(@PathVariable("comboId") Integer id, @RequestParam("image") MultipartFile image) {
        try {

            try {
                Combo sp =comboService.getComboById(id);
                Image savedImageData = fileLocationService.save(image);
                sp.setImage(savedImageData);
                // Update other fields as needed
                comboRepository.save(sp);
                return ResponseEntity.ok(sp);
            } catch (EntityNotFoundException e){

                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(value = "/image/{estabId}")
    public ResponseEntity<FileSystemResource> downloadImage(@PathVariable("estabId") Integer id) {
        try {
            Combo existingCombo =comboService.getComboById(id);
            FileSystemResource fileSystemResource = fileLocationService.find(existingCombo.getImage().getId());
            return  ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(fileSystemResource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

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


    @GetMapping("/findByRef")
    public ResponseEntity<?> getComboByRefAndEstablishmentId(@RequestParam("ref") String ref, @RequestParam("establishmentId") Integer establishmentId) {
        try {
            Combo combo = comboService.findComboByRefAndEstablishmentId(ref, establishmentId);
            return new ResponseEntity<>(combo, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
    }




}
