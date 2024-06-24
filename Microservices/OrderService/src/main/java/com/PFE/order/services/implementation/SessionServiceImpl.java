package com.PFE.order.services.implementation;

import com.PFE.order.entities.Issue;
import com.PFE.order.entities.Order;
import com.PFE.order.entities.Session;
import com.PFE.order.repos.SessionRepository;
import com.PFE.order.services.implementation.pdf.PDFType;
import com.PFE.order.services.implementation.pdf.PdfService;
import com.PFE.order.services.implementation.pdf.SessionPDF;
import com.PFE.order.services.implementation.pdf.SessionPDFRepository;
import com.PFE.order.services.service.SessionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@Component


public class SessionServiceImpl implements SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Override
    public Session createSession(Session session) {

        session.setStartTime(LocalDateTime.now());
        return sessionRepository.save(session);


    }

    @Override
    public Session getSessionById(Integer id) {

        Optional<Session> sessionOptional = sessionRepository.findById(id);
        return sessionOptional.orElseThrow(()->new EntityNotFoundException());
    }

    @Override
    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    @Override
    public List<Session> getSessionsByEstablishmentId(Integer establishmentId) {
        return sessionRepository.findByEstablishmentId(establishmentId);
    }


    @Override
    public List<Session> getSessionsByCashier(String username) {
        return sessionRepository.findByCashierUsername(username);
    }

    @Override
    public void deleteSession(Integer id) {
        sessionRepository.deleteById(id);
    }

    @Override
    /*public Session closeSession(Integer id,float actuaMoney){
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with id: " + id));

        if (!session.isStatus()) { // Assuming false means session is open
            throw new IllegalStateException("Session with id " + id + " is already closed.");
        }

        // Calculate total sales
        float totalSales = 0;
        for (Order order : session.getOrders()) {
            totalSales += order.getTotalPrice();
        }
        // Update session details
        session.setStatus(false); // Mark session as closed
        session.setCloseTime(LocalDateTime.now());

        // Save changes
        return sessionRepository.save(session);
    }*/



    public Session closeSession(Integer id, float actualMoney, String note) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with id: " + id));

        if (!session.isStatus()) { // Assuming true means session is open
            throw new IllegalStateException("Session with id " + id + " is already closed.");
        }

        // Calculate total sales
        float totalSales = 0;
        for (Order order : session.getOrders()) {
            totalSales += order.getTotalPrice();
        }

        // Set actual money and calculate the expected money
        session.setActualMoney(actualMoney);
        session.setExpectedMoney(totalSales + session.getStartMoney());

        // Determine issue based on actual and expected money
        if (actualMoney > session.getExpectedMoney()) {
            session.setIssue(Issue.PLUS);
        } else if (actualMoney < session.getExpectedMoney()) {
            session.setIssue(Issue.MINUS);
        } else {
            session.setIssue(Issue.NOISSUE);
        }

        // Set the note
        session.setNote(note);

        // Update session details
        session.setStatus(false); // Mark session as closed
        session.setCloseTime(LocalDateTime.now());

        // Save changes
        return sessionRepository.save(session);
    }

    @Override
    public Session updateExpectedMoney(Integer sessionId, float expectedMoney) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Session not found"));

        float newMoney=session.getExpectedMoney()+expectedMoney;
        session.setExpectedMoney(newMoney);
        return sessionRepository.save(session);
    }



    @Autowired
    private PdfService pdfService;

    @Autowired
    private SessionPDFRepository sessionPDFRepository;


    public Set<Integer> getAllUniqueEstablishmentIds() {
        List<Session> sessions = sessionRepository.findAll();
        return sessions.stream()
                .map(Session::getEstablishmentId)
                .collect(Collectors.toSet());
    }

    @Scheduled(fixedRate = 600000) // Run every 10 seconds
    public void generateDailyReportsForAllEstablishments() {
        Set<Integer> establishmentIds = getAllUniqueEstablishmentIds();
        log.info("Scheduled task started.");
        for (Integer establishmentId : establishmentIds) {
            generateDailyReportForEstablishment(establishmentId);
        }
    }

    public void generateDailyReportForEstablishment(Integer establishmentId) {
        LocalDateTime todayStart = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime tomorrowStart = LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.MIN);
        List<Session> closedSessionsToday = sessionRepository.findClosedSessionsForEstablishmentToday(establishmentId, todayStart, tomorrowStart);

        if (!closedSessionsToday.isEmpty()) {
            byte[] pdfContent = pdfService.generateSessionsPdf(closedSessionsToday);
            SessionPDF sessionPDF = new SessionPDF();
            sessionPDF.setPdfContent(pdfContent);
            sessionPDF.setCreationTime(LocalDateTime.now());
            sessionPDF.setName("rapport quotidien " +"pv:" +establishmentId + " " + LocalDate.now().toString());
            sessionPDF.setPdftype(PDFType.QUOTIDIEN);
            sessionPDFRepository.save(sessionPDF);
        }
    }

    @Scheduled(fixedRate = 600000) // Run every 20 seconds
    public void generateMonthlyReportsForAllEstablishments() {
        Set<Integer> establishmentIds = getAllUniqueEstablishmentIds();
        for (Integer establishmentId : establishmentIds) {
            generateMonthlyReportForEstablishment(establishmentId);
        }
    }

    public void generateMonthlyReportForEstablishment(Integer establishmentId) {
        LocalDate today = LocalDate.now();
        List<Session> closedSessionsThisMonth = sessionRepository.findClosedSessionsForEstablishmentThisMonth(establishmentId, today.getYear(), today.getMonthValue());

        if (!closedSessionsThisMonth.isEmpty()) {
            byte[] pdfContent = pdfService.generateSessionsPdf(closedSessionsThisMonth);
            SessionPDF sessionPDF = new SessionPDF();
            sessionPDF.setPdfContent(pdfContent);
            sessionPDF.setCreationTime(LocalDateTime.now());
            sessionPDF.setName("rapport mensuel " +"pv:"+ establishmentId + " " + today.getMonth().toString() + " " + today.getYear());
            sessionPDF.setPdftype(PDFType.MENSUEL);
            sessionPDFRepository.save(sessionPDF);
        }
    }

    @Scheduled(fixedRate = 600000) // Run every 30 seconds
    public void generateAnnualReportsForAllEstablishments() {
        Set<Integer> establishmentIds = getAllUniqueEstablishmentIds();
        for (Integer establishmentId : establishmentIds) {
            generateAnnualReportForEstablishment(establishmentId);
        }
    }

    public void generateAnnualReportForEstablishment(Integer establishmentId) {
        LocalDate today = LocalDate.now();
        List<Session> closedSessionsThisYear = sessionRepository.findClosedSessionsForEstablishmentThisYear(establishmentId, today.getYear());

        if (!closedSessionsThisYear.isEmpty()) {
            byte[] pdfContent = pdfService.generateSessionsPdf(closedSessionsThisYear);
            SessionPDF sessionPDF = new SessionPDF();
            sessionPDF.setPdfContent(pdfContent);
            sessionPDF.setCreationTime(LocalDateTime.now());
            sessionPDF.setName("rapport annuel " +"pv:"+ establishmentId + " " + today.getYear());
            sessionPDF.setPdftype(PDFType.ANNUEL);
            sessionPDFRepository.save(sessionPDF);
        }
    }

}

//@Scheduled(cron = "0 0 0 1 * *") // Run every month on the first day at midnight

//@Scheduled(cron = "0 0 0 1 1 *") // Run every year on January 1st at midnight

//@Scheduled(cron = "0 0 0 * * *") // Run every day at midnight
