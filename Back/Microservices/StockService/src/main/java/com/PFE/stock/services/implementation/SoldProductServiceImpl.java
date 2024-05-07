package com.PFE.stock.services.implementation;


import com.PFE.stock.entities.*;
import com.PFE.stock.repos.*;
import com.PFE.stock.services.interfaces.SoldProductService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@Slf4j
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
    @Autowired
    private ComboRepository comboRepository;

    @Override
    public SoldProduct addSoldProduct(Integer establishmentId, SoldProduct soldProduct) {
        // Step 1: Retrieve the establishment
        Establishment establishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Establishment not found"));

        // Step 2: Check if a sold product with the same name or ref already exists in the given establishment
        Optional<SoldProduct> soldProductWithSameName = soldProductRepository.findByNameAndCategoryEstablishment(soldProduct.getName(), establishment);
        Optional<SoldProduct> soldProductWithSameRef = soldProductRepository.findByRefAndCategoryEstablishment(soldProduct.getRef(), establishment);

        if (soldProductWithSameName.isPresent() || soldProductWithSameRef.isPresent()) {
            throw new EntityExistsException("A sold product with this name or ref already exists in the given establishment");
        }

        // Step 3: Retrieve the category
        Category category = categoryRepository.findById(soldProduct.getCategory().getId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        // Step 4: Set category and createdAt for the sold product
        soldProduct.setCategory(category);
        soldProduct.setCreatedAt(LocalDateTime.now());
        soldProduct.setStatus(true);

        // Step 5: Check if stockEquivalents is not null before iterating
        if (soldProduct.getStockEquivalents() != null) {
            // Step 6: Iterate through stockEquivalents and set associations
            for (StockEquivalent stockEquivalent : soldProduct.getStockEquivalents()) {
                StockProduct sp = stockProductRepository.findById(stockEquivalent.getStockproduct().getId())
                        .orElseThrow(() -> new EntityNotFoundException("StockProduct not found"));

                stockEquivalent.setSoldProduct(soldProduct);  // Associate with the unsaved soldProduct
                stockEquivalent.setStockproduct(sp);
                log.warn("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
            }
        }

        // Step 7: Save the sold product and return the saved instance
        SoldProduct savedSoldProduct = soldProductRepository.save(soldProduct);
        return savedSoldProduct;
    }


    @Override
    public SoldProduct updateSoldProduct(Integer establishmentId, Integer soldProductId, SoldProduct updatedSoldProduct) {
        Establishment establishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Establishment not found"));

        // Step 2: Retrieve the existing sold product by ID
        SoldProduct existingSoldProduct = soldProductRepository.findById(soldProductId)
                .orElseThrow(() -> new EntityNotFoundException("SoldProduct not found"));

        // Step 3: Check if the existing sold product belongs to the specified establishment
        if (!existingSoldProduct.getCategory().getEstablishment().equals(establishment)) {
            throw new EntityNotFoundException("SoldProduct not found in the given establishment");}

        // Step 3: Check if the updated name or ref already exists for another sold product in the same establishment
        String updatedName = updatedSoldProduct.getName();
        String updatedRef = updatedSoldProduct.getRef();

        if (!existingSoldProduct.getName().equals(updatedName) || !existingSoldProduct.getRef().equals(updatedRef)) {
            Optional<SoldProduct> soldProductWithSameName = soldProductRepository.findByNameAndCategoryEstablishment(updatedName, establishment);
            Optional<SoldProduct> soldProductWithSameRef = soldProductRepository.findByRefAndCategoryEstablishment(updatedRef, establishment);

            if ((soldProductWithSameName.isPresent() && !soldProductWithSameName.get().getId().equals(existingSoldProduct.getId())) ||
                    (soldProductWithSameRef.isPresent() && !soldProductWithSameRef.get().getId().equals(existingSoldProduct.getId()))) {
                throw new EntityExistsException("A sold product with this name or ref already exists in the given establishment");
            }
        }

        // Step 4: Update the fields of the existing sold product
        existingSoldProduct.setName(updatedSoldProduct.getName());
        existingSoldProduct.setRef(updatedSoldProduct.getRef());
        existingSoldProduct.setPrice(updatedSoldProduct.getPrice());
        existingSoldProduct.setStatus(updatedSoldProduct.isStatus());

        // Step 5: Update category if it's different
        Category updatedCategory = categoryRepository.findById(updatedSoldProduct.getCategory().getId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        if (!existingSoldProduct.getCategory().equals(updatedCategory)) {
            existingSoldProduct.setCategory(updatedCategory);
        }

        // Step 6: Update stockEquivalents
        List<StockEquivalent> updatedStockEquivalents = updatedSoldProduct.getStockEquivalents();
        if (updatedStockEquivalents != null) {
            // Clear existing stockEquivalents and set the new ones
            existingSoldProduct.getStockEquivalents().clear();
            for (StockEquivalent stockEquivalent : updatedStockEquivalents) {
                StockProduct sp = stockProductRepository.findById(stockEquivalent.getStockproduct().getId())
                        .orElseThrow(() -> new EntityNotFoundException("StockProduct not found"));

                stockEquivalent.setSoldProduct(existingSoldProduct);
                stockEquivalent.setStockproduct(sp);
                existingSoldProduct.getStockEquivalents().add(stockEquivalent);
            }
        } else {
            // If the updatedStockEquivalents is null, clear the existing ones
            existingSoldProduct.getStockEquivalents().clear();
        }

        // Save the updated sold product
        SoldProduct updatedSoldProductEntity = soldProductRepository.save(existingSoldProduct);

        return updatedSoldProductEntity;
    }



    @Override
    public void deleteSoldProduct(Integer soldProductId) {
        SoldProduct soldProduct = soldProductRepository.findById(soldProductId).orElse(null);
        if (soldProduct != null) {
            // Fetch all combos that contain the soldProduct
            List<Combo> combosToDelete = comboRepository.findBySoldProduct(soldProduct);

            // Remove all sold products from combos
            for (Combo combo : combosToDelete) {
                combo.getSoldProducts().clear();
                comboRepository.save(combo);
            }

            // Delete the combos
            comboRepository.deleteAll(combosToDelete);

            // Delete the soldProduct
            soldProductRepository.delete(soldProduct);
        }
    }



    @Override
    public List<SoldProduct> getAllSoldProducts(Integer establishmentId) {
        Establishment establishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Establishment not found"));

        return soldProductRepository.findAllByCategoryEstablishment(establishment);
    }


    @Autowired
    private StockEquivalentRepository stockEquivalentRepository;

    public List<StockEquivalent> getAllStockEquivalents() {
        return stockEquivalentRepository.findAll();
    }

    public Optional<StockEquivalent> getStockEquivalentById(Integer id) {
        return stockEquivalentRepository.findById(id);
    }

    public void deleteStockEquivalentById(Integer id) {
        stockEquivalentRepository.deleteById(id);
    }

    public void deleteAllStockEquivalents() {
        stockEquivalentRepository.deleteAll();
    }


    @Override
    public SoldProduct getById(Integer id) {
        Optional<SoldProduct> soldProductOptional = soldProductRepository.findById(id);
        return soldProductOptional.orElseThrow(()->new EntityNotFoundException());
    }


    @Override
    public SoldProduct findByRef(String ref,Integer establishmentId) {
        Optional<SoldProduct> soldProductOptional = soldProductRepository.findByRefAndCategoryEstablishmentId(ref,establishmentId);
        return soldProductOptional.orElseThrow(()->new EntityNotFoundException());
    }
}
