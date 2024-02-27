package com.PFE.stock.controllers.done;


import com.PFE.stock.entities.Establishment;
import com.PFE.stock.services.interfaces.done.EstablishmentService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/establishments")
public class EstablishmentController {

    private final EstablishmentService establishmentService;

    public EstablishmentController(EstablishmentService establishmentService) {
        this.establishmentService = establishmentService;
    }

    @PostMapping("/add-establishment")
    public ResponseEntity<Establishment> addEstablishment(@RequestBody Establishment establishment) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(establishmentService.addEstablishment(establishment));
        } catch (EntityExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PutMapping("/update-establishment/{id}")
    public ResponseEntity<Establishment> updateEstablishment(
            @PathVariable("id") Integer establishmentId,
            @RequestBody Establishment updatedEstablishment
    ) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(establishmentService.updateEstablishment(establishmentId, updatedEstablishment));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (EntityExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @DeleteMapping("/delete-establishment/{id}")
    public ResponseEntity<Void> deleteEstablishment(@PathVariable("id") Integer establishmentId) {
        try {
            establishmentService.deleteEstablishment(establishmentId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/get-all-establishments")
    public ResponseEntity<List<Establishment>> getAllEstablishments() {
        return ResponseEntity.status(HttpStatus.OK).body(establishmentService.getAllEstablishments());
    }
}
