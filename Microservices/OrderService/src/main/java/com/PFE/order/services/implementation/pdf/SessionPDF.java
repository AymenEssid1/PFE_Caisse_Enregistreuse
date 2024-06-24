package com.PFE.order.services.implementation.pdf;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table (name = "session_pdf")
public class SessionPDF {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer EstablishmentId;

    private String name;


    @Enumerated(EnumType.STRING)
    private PDFType pdftype;

    @Lob
    @Column(name = "pdf_content", columnDefinition = "MEDIUMBLOB")

    private byte[] pdfContent;

    @Column(name = "creation_time")
    private LocalDateTime creationTime;

    // Add any additional metadata fields you might need
}

