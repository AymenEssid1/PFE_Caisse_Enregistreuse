package com.PFE.order.controllers;


import com.PFE.order.entities.Session;
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



    @PostMapping("/create")
    public ResponseEntity<Session> createSession(@RequestBody Session session) {

        return ResponseEntity.status(HttpStatus.CREATED).body(sessionService.createSession(session));

    }

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




}
