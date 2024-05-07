package com.PFE.order.services.service;

import com.PFE.order.entities.Session;
import com.PFE.order.services.exceptions.CashDiscrepancyException;

import java.util.List;

public interface SessionService {



        Session createSession(Session session);
        Session getSessionById(Integer id);
        List<Session> getAllSessions();
        void deleteSession(Integer id);
        void closeSession(Integer id) throws CashDiscrepancyException;

}
