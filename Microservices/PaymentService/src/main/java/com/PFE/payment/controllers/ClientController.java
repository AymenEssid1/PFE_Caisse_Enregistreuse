package com.PFE.payment.controllers;
import com.PFE.payment.entities.Client;
import com.PFE.payment.services.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;


@RestController
@RequestMapping("/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @GetMapping("/find")
    public ResponseEntity<Client> findClientByEmailOrPhoneNumberAndEstablishmentId(
            @RequestParam("query") String emailOrPhoneNumber,
            @RequestParam("establishmentId") Integer establishmentId) {
        try {
            Client client = clientService.findClientByEmailOrPhoneNumberAndEstablishmentId(emailOrPhoneNumber, establishmentId);
            return ResponseEntity.ok().body(client);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }



    @GetMapping("/getallBy")
    public List<Client> getAllClients(@RequestParam("id") Integer establishmentId) {
        return clientService.getAllClients(establishmentId);
    }

    @GetMapping("/getby/{id}")
    public Client getClientById(@PathVariable("id") Integer id) {
        try {
            return clientService.getClientById(id);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping("/add")
    public Client saveClient(@RequestBody Client client) {
        try {
            return clientService.saveClient(client);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }
    }

    @DeleteMapping("delete/{id}")
    public void deleteClient(@PathVariable("id") Integer id) {
        try {
            clientService.deleteClient(id);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PutMapping("updateFP/{id}/fidelity-points")
    public Client updateFidelityPoints(@PathVariable("id") Integer id, @RequestBody float fidelityPoints) {
        try {
            return clientService.updateFidelityPoints(id, fidelityPoints);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @GetMapping("/getall")
    public List<Client> getAllClients() {
        return clientService.getAllClients();
    }




}
