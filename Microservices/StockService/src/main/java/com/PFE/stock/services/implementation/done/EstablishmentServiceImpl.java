package com.PFE.stock.services.implementation.done;


import com.PFE.stock.entities.Category;
import com.PFE.stock.entities.Establishment;
import com.PFE.stock.entities.StockProduct;
import com.PFE.stock.entities.Tables;
import com.PFE.stock.repos.CategoryRepository;
import com.PFE.stock.repos.EstablishmentRepository;
import com.PFE.stock.repos.StockProductRepository;
import com.PFE.stock.repos.TablesRepository;
import com.PFE.stock.services.interfaces.done.EstablishmentService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EstablishmentServiceImpl implements EstablishmentService {

    private final EstablishmentRepository establishmentRepository;




    public EstablishmentServiceImpl(EstablishmentRepository establishmentRepository) {
        this.establishmentRepository = establishmentRepository;
    }

    @Autowired
    private StockProductRepository stockProductRepository;

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private TablesRepository tablesRepository;

    public void TransferData(Integer establishmentId, Integer targetEstablishmentId) {
        Establishment establishmentToDelete = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Establishment not found"));

        Establishment targetEstablishment = establishmentRepository.findById(targetEstablishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Target establishment not found"));

        // Transfer stock products
        for (StockProduct stockProduct : establishmentToDelete.getStockProducts()) {
            stockProduct.setEstablishment(targetEstablishment);
            stockProductRepository.save(stockProduct);
        }

        // Transfer categories
        for (Category category : establishmentToDelete.getCategories()) {
            category.setEstablishment(targetEstablishment);
            categoryRepository.save(category);
        }


    }

    @Override
    public Establishment addEstablishment(Establishment establishment) {
        if (establishmentRepository.findByName(establishment.getName()).isPresent()) {
            throw new EntityExistsException("An establishment with this name already exists");
        }

        // Iterate over the tables of the establishment and set the establishment for each table
        establishment.getTables().forEach(table -> table.setEstablishment(establishment));

        return establishmentRepository.save(establishment);
    }


    @Override
    @Transactional // Ensure that the operation is executed within a transaction
    public Establishment updateEstablishment(Integer establishmentId, Establishment updatedEstablishment) {
        Establishment existingEstablishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Establishment not found"));

        Optional<Establishment> establishmentWithSameName = establishmentRepository.findByName(updatedEstablishment.getName());
        if (establishmentWithSameName.isPresent() && !establishmentWithSameName.get().getId().equals(existingEstablishment.getId())) {
            throw new EntityExistsException("Another establishment with this name already exists");
        }

        // Update establishment fields
        existingEstablishment.setName(updatedEstablishment.getName());

        existingEstablishment.setTableSystem(updatedEstablishment.isTableSystem());
        existingEstablishment.setScanSystem(updatedEstablishment.isScanSystem());
        existingEstablishment.setFidelitySystem(updatedEstablishment.isFidelitySystem());

        existingEstablishment.setFidelityRatio(updatedEstablishment.getFidelityRatio());
        existingEstablishment.setCashOutRatio(updatedEstablishment.getCashOutRatio());


        // Save the updated establishment
        Establishment savedEstablishment = establishmentRepository.save(existingEstablishment);

        // Update associated tables
        List<Tables> updatedTables = updatedEstablishment.getTables();
        for (Tables table : updatedTables) {
            // Ensure each table is associated with the saved establishment
            table.setEstablishment(savedEstablishment);
            // Save or update each table individually
            tablesRepository.save(table);
        }

        return savedEstablishment;
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


    @Override
    public Tables updateTableStatus(Integer tableId, Boolean status) {
        Tables table = tablesRepository.findById(tableId)
                .orElseThrow(() -> new EntityNotFoundException("Table not found with id: " + tableId));

        table.setStatus(status);
        return tablesRepository.save(table);
    }
}
