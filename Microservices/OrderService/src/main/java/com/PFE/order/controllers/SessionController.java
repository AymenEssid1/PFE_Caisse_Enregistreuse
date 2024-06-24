package com.PFE.order.controllers;


import com.PFE.order.entities.CloseSessionRequest;
import com.PFE.order.entities.Session;
import com.PFE.order.services.exceptions.CashDiscrepancyException;
import com.PFE.order.services.service.SessionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/session")
public class SessionController {


    @Autowired
    private SessionService sessionService;





    @GetMapping("/getby/{id}")
    public  ResponseEntity<?>  getSessionById(@PathVariable("id") Integer id) {

        try{Session session = sessionService.getSessionById(id);

            return new ResponseEntity<>(session, HttpStatus.OK);
        } catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getAll")
    public List<Session> getAllSessions() {
        return sessionService.getAllSessions();
    }

    @DeleteMapping("delete/{id}")
    public void deleteSession(@PathVariable("id") Integer id) {
        sessionService.deleteSession(id);
    }


    @GetMapping("/establishment/{establishmentId}")
    public ResponseEntity<List<Session>> getSessionsByEstablishmentId(@PathVariable("establishmentId") Integer establishmentId) {
        List<Session> sessions = sessionService.getSessionsByEstablishmentId(establishmentId);
        if (sessions.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(sessions, HttpStatus.OK);
    }


    @GetMapping("/cashier/{username}")
    public ResponseEntity<List<Session>> getSessionsByCashier(@PathVariable("username") String username) {
        List<Session> sessions = sessionService.getSessionsByCashier(username);
        if (sessions.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(sessions, HttpStatus.OK);
    }

    /*@PutMapping("/close/{id}")
    public ResponseEntity<?> closeSession(@PathVariable("id") Integer id, @RequestParam("actualMoney") float actualMoney) {
        try {

            return ResponseEntity.status(HttpStatus.OK).body(sessionService.closeSession(id, actualMoney));

        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.notFound().build();
        }
    }*/

    @PutMapping("/close/{id}")
    public ResponseEntity<?> closeSession(@PathVariable("id") Integer id, @RequestBody CloseSessionRequest request) {
        try {
            Session closedSession = sessionService.closeSession(id, request.getActualMoney(), request.getNote());
            return ResponseEntity.status(HttpStatus.OK).body(closedSession);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }




    @PostMapping("/create")
    public ResponseEntity<Session> createSession(@RequestBody Session session) {

        return ResponseEntity.status(HttpStatus.CREATED).body(sessionService.createSession(session));

    }

    @PutMapping("/{sessionId}/expected-money")
    public ResponseEntity<?> updateExpectedMoney(@PathVariable("sessionId") Integer sessionId,
                                                 @RequestBody  float expectedMoney) {
        try {
            Session updatedSession = sessionService.updateExpectedMoney(sessionId, expectedMoney);
            return ResponseEntity.ok(updatedSession);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating expected money for session");
        }
    }


}
