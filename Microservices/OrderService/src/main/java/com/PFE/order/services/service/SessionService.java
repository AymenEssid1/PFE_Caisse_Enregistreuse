package com.PFE.order.services.service;

import com.PFE.order.entities.Session;
import com.PFE.order.services.exceptions.CashDiscrepancyException;

import java.util.List;

public interface SessionService {



        Session createSession(Session session);
        Session getSessionById(Integer id);
        List<Session> getAllSessions();
        void deleteSession(Integer id);
        //Session closeSession(Integer id,float actualMoney);
        public Session closeSession(Integer id, float actualMoney, String note);
      List<Session> getSessionsByEstablishmentId(Integer establishmentId);

      List<Session> getSessionsByCashier(String username) ;
    Session updateExpectedMoney(Integer sessionId, float expectedMoney);

}
