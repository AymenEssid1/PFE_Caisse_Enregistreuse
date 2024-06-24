package com.PFE.order.services.implementation.pdf;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/session-pdfs")
public class SessionPDFController {

    @Autowired
    private SessionPDFRepository sessionPDFRepository;


    @GetMapping
    public List<SessionPDF> getAllSessionPDFs() {
        return sessionPDFRepository.findAll();
    }



    @DeleteMapping("/all")
    public ResponseEntity<?> deleteAllSessionPDFs() {
        try {
            sessionPDFRepository.deleteAll();
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting all session PDFs: " + e.getMessage());
        }
    }


    /*@GetMapping("/{establishmentId}")
    public List<SessionPDF> getSessionPDFsByEstablishmentId(@PathVariable("establishmentId") Integer establishmentId) {
        return sessionPDFRepository.findByEstablishmentId(establishmentId);
    }*/

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> downloadSessionPdf(@PathVariable("id") Integer id) {
        SessionPDF sessionPDF = sessionPDFRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session PDF not found"));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "session_report_" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(sessionPDF.getPdfContent());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSessionPdf(@PathVariable("id") Integer id) {
        SessionPDF sessionPDF = sessionPDFRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session PDF not found"));

        sessionPDFRepository.delete(sessionPDF);
        return ResponseEntity.ok().build();
    }


}

