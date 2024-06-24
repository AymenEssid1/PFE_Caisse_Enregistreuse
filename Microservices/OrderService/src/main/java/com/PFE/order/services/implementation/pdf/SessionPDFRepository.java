package com.PFE.order.services.implementation.pdf;

import com.PFE.order.services.implementation.pdf.SessionPDF;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionPDFRepository extends JpaRepository<SessionPDF, Integer> {


}
