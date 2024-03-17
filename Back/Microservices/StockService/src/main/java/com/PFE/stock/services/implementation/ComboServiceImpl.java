package com.PFE.stock.services.implementation;

import com.PFE.stock.entities.Combo;
import com.PFE.stock.entities.Establishment;
import com.PFE.stock.entities.SoldProduct;
import com.PFE.stock.repos.ComboRepository;
import com.PFE.stock.repos.EstablishmentRepository;
import com.PFE.stock.repos.SoldProductRepository;
import com.PFE.stock.services.interfaces.ComboService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
@Slf4j
public class ComboServiceImpl implements ComboService {

    @Autowired
    private ComboRepository comboRepository;
    @Autowired
    private EstablishmentRepository establishmentRepository;
    @Autowired
    private SoldProductRepository soldProductRepository;



    @Override
    public Combo addCombo(Integer establishmentId, Combo combo) {
        // Check if the Establishment exists
        Establishment establishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Establishment not found"));

        List<SoldProduct> existingSoldProducts = new ArrayList<>();
        List<SoldProduct> soldProducts = combo.getSoldProducts();

        if (soldProducts != null) {
            for (SoldProduct soldProduct : soldProducts) {
                if (soldProduct.getId() != null) {
                    // Check if each sold product actually exists in the database
                    Optional<SoldProduct> existingSoldProduct = soldProductRepository.findById(soldProduct.getId());
                    if (existingSoldProduct.isEmpty()) {
                        throw new EntityNotFoundException("Sold Product with ID " + soldProduct.getId() + " not found");
                    }
                    // Add the existing sold product to the list
                    existingSoldProducts.add(existingSoldProduct.get());
                } else {
                    throw new IllegalArgumentException("Sold Product ID cannot be null");
                }
            }
            combo.setSoldProducts(existingSoldProducts);
        } else {
            throw new IllegalArgumentException("Cannot have a combo with no products");
        }


        combo.setCreatedAt(LocalDateTime.now());

        return comboRepository.save(combo);
    }




    @Override
    public void deleteCombo(Integer comboId) {
        comboRepository.deleteById(comboId);
    }

    @Override
    public List<Combo> getAllCombos(Integer establishmentId) {
       /* Establishment establishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Establishment not found"));
        List<SoldProduct> soldProducts = soldProductRepository.findAllByCategoryEstablishment(establishment);
        Set<Combo> combos = new HashSet<>();

        for (SoldProduct soldProduct : soldProducts) {
            Combo combo = soldProduct.getCombo();
            if (combo != null) {
                combos.add(combo);
            }
        }*/

        return new ArrayList<>();

    }

    @Override
    public Combo getComboById(Integer comboId) {
        return comboRepository.findById(comboId)
                .orElseThrow(() -> new EntityNotFoundException("Combo not found"));
    }






}
