package com.PFE.stock.services.implementation;


import com.PFE.stock.entities.*;
import com.PFE.stock.repos.*;
import com.PFE.stock.services.interfaces.SoldProductService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SoldProductServiceImpl implements SoldProductService {

    private final SoldProductRepository soldProductRepository;
    private final EstablishmentRepository establishmentRepository;
    private final  CategoryRepository categoryRepository;
    @Autowired
    private StockProductRepository stockProductRepository;

    public SoldProductServiceImpl(SoldProductRepository soldProductRepository, EstablishmentRepository establishmentRepository,CategoryRepository categoryRepository) {
        this.soldProductRepository = soldProductRepository;
        this.establishmentRepository = establishmentRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public SoldProduct addSoldProduct(Integer establishmentId, SoldProduct soldProduct) {
        Establishment establishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Establishment not found"));

        Optional<SoldProduct> soldProductWithSameName = soldProductRepository.findByNameAndCategoryEstablishment(soldProduct.getName(), establishment);
        Optional<SoldProduct> soldProductWithSameRef = soldProductRepository.findByRefAndCategoryEstablishment(soldProduct.getRef(), establishment);

        if (soldProductWithSameName.isPresent() || soldProductWithSameRef.isPresent()) {
            throw new EntityExistsException("A sold product with this name or ref already exists in the given establishment");
        }

        Category category = categoryRepository.findById(soldProduct.getCategory().getId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        soldProduct.setCategory(category);
        soldProduct.setCreatedAt(LocalDateTime.now());

        // Check if stockEquivalents is not null before iterating
        if (soldProduct.getStockEquivalents() != null) {
            for (StockEquivalent stockEquivalent : soldProduct.getStockEquivalents()) {
                StockProduct sp = stockProductRepository.findById(stockEquivalent.getStockproduct().getId())
                        .orElseThrow(() -> new EntityNotFoundException("StockProduct not found"));

                stockEquivalent.setSoldProduct(soldProduct);
                stockEquivalent.setStockproduct(sp);
            }
        }

        return soldProductRepository.save(soldProduct);
    }


    @Override
    public SoldProduct updateSoldProduct(Integer establishmentId, Integer soldProductId, SoldProduct updatedSoldProduct) {
        Establishment establishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Establishment not found"));

        SoldProduct existingSoldProduct = soldProductRepository.findById(soldProductId)
                .orElseThrow(() -> new EntityNotFoundException("Sold Product not found"));

        Optional<SoldProduct> soldProductWithSameName = soldProductRepository.findByNameAndCategoryEstablishment(updatedSoldProduct.getName(), establishment);
        Optional<SoldProduct> soldProductWithSameRef = soldProductRepository.findByRefAndCategoryEstablishment(updatedSoldProduct.getRef(), establishment);



        if (soldProductWithSameName.isPresent() || soldProductWithSameRef.isPresent()) {
            throw new EntityExistsException("A sold product with this name or ref already exists in the given establishment");
        }
        Category category = categoryRepository.findById(updatedSoldProduct.getCategory().getId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        updatedSoldProduct.setCategory(category);
        updatedSoldProduct.setCreatedAt(LocalDateTime.now());

        // Check if stockEquivalents is not null before iterating
        if (updatedSoldProduct.getStockEquivalents() != null) {
            for (StockEquivalent stockEquivalent : updatedSoldProduct.getStockEquivalents()) {
                StockProduct sp = stockProductRepository.findById(stockEquivalent.getStockproduct().getId())
                        .orElseThrow(() -> new EntityNotFoundException("StockProduct not found"));

                stockEquivalent.setSoldProduct(updatedSoldProduct);
                stockEquivalent.setStockproduct(sp);
            }
        }

        // Update other fields as needed
        existingSoldProduct.setRef(updatedSoldProduct.getRef());
        existingSoldProduct.setName(updatedSoldProduct.getName());
        existingSoldProduct.setPrice(updatedSoldProduct.getPrice());
        // Update other fields as needed

        return soldProductRepository.save(existingSoldProduct);
    }


    @Override
    public void deleteSoldProduct(Integer soldProductId) {
        soldProductRepository.deleteById(soldProductId);
    }

    @Override
    public List<SoldProduct> getAllSoldProducts(Integer establishmentId) {
        Establishment establishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Establishment not found"));

        return soldProductRepository.findAllByCategoryEstablishment(establishment);
    }
}
