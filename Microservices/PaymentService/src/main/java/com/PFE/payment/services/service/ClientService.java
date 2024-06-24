package com.PFE.payment.services.service;

import com.PFE.payment.entities.Client;

import java.util.List;

public interface ClientService {
    List<Client> getAllClients();
    Client getClientById(Integer id);
    Client saveClient(Client client);
    void deleteClient(Integer id);
    Client updateFidelityPoints(Integer id, float fidelityPoints);
    List<Client> getAllClients(Integer establishmentId);
    Client findClientByEmailOrPhoneNumberAndEstablishmentId(String emailOrPhoneNumber, Integer establishmentId);
}

