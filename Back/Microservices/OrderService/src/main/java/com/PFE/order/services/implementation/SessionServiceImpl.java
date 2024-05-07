package com.PFE.order.services.implementation;

import com.PFE.order.entities.Order;
import com.PFE.order.entities.Session;
import com.PFE.order.repos.SessionRepository;
import com.PFE.order.services.exceptions.CashDiscrepancyException;
import com.PFE.order.services.service.SessionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class SessionServiceImpl implements SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Override
    public Session createSession(Session session) {
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
    public void deleteSession(Integer id) {
        sessionRepository.deleteById(id);
    }

    @Override
    public void closeSession(Integer id) throws CashDiscrepancyException {
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

        // Check cash balance
        float expectedCash = session.getStartMoney() + totalSales;
        if (expectedCash != session.getActualMoney()) {
            throw new CashDiscrepancyException(" money does not match ");
        }

        // Update session details
        session.setStatus(false); // Mark session as closed
        session.setCloseTime(LocalDateTime.now());

        // Save changes
        sessionRepository.save(session);
    }
}
