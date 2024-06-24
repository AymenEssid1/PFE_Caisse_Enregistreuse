package com.PFE.payment.services.implementation;


import com.PFE.payment.entities.Client;
import com.PFE.payment.repos.ClientRepository;
import com.PFE.payment.services.service.ClientService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service

public class ClientServiceImp implements ClientService {



    @Autowired
    private ClientRepository clientRepository;

    @Override
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Override
    public List<Client> getAllClients(Integer establishmentId) {
        return clientRepository.findAllByEstablishmentId(establishmentId);
    }

    @Override
    public Client getClientById(Integer id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with id " + id));
    }

    @Override
    public Client saveClient(Client client) {
        if (clientRepository.existsByEmailAndEstablishmentId(client.getEmail(), client.getEstablishmentId())) {
            throw new DataIntegrityViolationException("Email is already used by another client in the same establishment");
        }

        if (clientRepository.existsByPhoneAndEstablishmentId(client.getPhone(), client.getEstablishmentId())) {
            throw new DataIntegrityViolationException("Phone is already used by another client in the same establishment");
        }
        return clientRepository.save(client);
    }

    @Override
    public void deleteClient(Integer id) {
        if (!clientRepository.existsById(id)) {
            throw new EntityNotFoundException("Client not found with id " + id);
        }
        clientRepository.deleteById(id);
    }


    @Override
    public Client updateFidelityPoints(Integer id, float fidelityPoints) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with id " + id));

        client.setFidelityPoints(fidelityPoints);
        return clientRepository.save(client);
    }


    @Override
    public Client findClientByEmailOrPhoneNumberAndEstablishmentId(String emailOrPhoneNumber, Integer establishmentId) {
        // First, search by email and establishment ID
        Optional<Client> clientByEmail = clientRepository.findByEmailAndEstablishmentId(emailOrPhoneNumber, establishmentId);
        if (clientByEmail.isPresent()) {
            return clientByEmail.get();
        }

        // If not found, search by phone number and establishment ID
        Optional<Client> clientByPhoneNumber = clientRepository.findByPhoneAndEstablishmentId(emailOrPhoneNumber, establishmentId);
        if (clientByPhoneNumber.isPresent()) {
            return clientByPhoneNumber.get();
        }

        // If no client is found with the provided email or phone number and establishment ID, throw exception
        throw new EntityNotFoundException("Client not found with provided email or phone number");
    }
}
