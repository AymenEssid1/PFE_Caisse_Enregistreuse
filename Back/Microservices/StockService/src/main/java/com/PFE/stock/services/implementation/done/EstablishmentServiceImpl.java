package com.PFE.stock.services.implementation.done;


import com.PFE.stock.entities.Establishment;
import com.PFE.stock.repos.EstablishmentRepository;
import com.PFE.stock.services.interfaces.done.EstablishmentService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EstablishmentServiceImpl implements EstablishmentService {

    private final EstablishmentRepository establishmentRepository;

    public EstablishmentServiceImpl(EstablishmentRepository establishmentRepository) {
        this.establishmentRepository = establishmentRepository;
    }

    @Override
    public Establishment addEstablishment(Establishment establishment) {
        if (establishmentRepository.findByName(establishment.getName()).isPresent()) {
            throw new EntityExistsException("An establishment with this name already exists");
        }
        return establishmentRepository.save(establishment);
    }

    @Override
    public Establishment updateEstablishment(Integer establishmentId, Establishment updatedEstablishment) {
        Establishment existingEstablishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Establishment not found"));

        Optional<Establishment> establishmentWithSameName = establishmentRepository.findByName(updatedEstablishment.getName());
        if (establishmentWithSameName.isPresent() && !establishmentWithSameName.get().getId().equals(existingEstablishment.getId())) {
            throw new EntityExistsException("Another establishment with this name already exists");
        }

        existingEstablishment.setName(updatedEstablishment.getName());
        // Update other fields as needed
        return establishmentRepository.save(existingEstablishment);
    }

    @Override
    public void deleteEstablishment(Integer establishmentId) {
        establishmentRepository.deleteById(establishmentId);
    }

    @Override
    public Establishment getById(Integer establishmentId) {

        return establishmentRepository.findById(establishmentId).orElseThrow(() -> new EntityNotFoundException("establishment not found"));
    }

    @Override
    public List<Establishment> getAllEstablishments() {
        return establishmentRepository.findAll();
    }
}
