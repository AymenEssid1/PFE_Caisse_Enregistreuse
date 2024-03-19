package com.PFE.stock.services.implementation;

import com.PFE.stock.entities.Combo;
import com.PFE.stock.entities.Establishment;
import com.PFE.stock.entities.SoldProduct;
import com.PFE.stock.repos.ComboRepository;
import com.PFE.stock.repos.EstablishmentRepository;
import com.PFE.stock.repos.SoldProductRepository;
import com.PFE.stock.services.Exceptions.ComboNotFoundException;
import com.PFE.stock.services.Exceptions.DuplicateComboException;
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
    private SoldProductRepository soldProductRepository; // Assuming SoldProductRepository exists

    @Override
    public Combo createCombo(Combo combo) throws DuplicateComboException {
        if (comboRepository.findByRef(combo.getRef()) != null || comboRepository.findByName(combo.getName()) != null) {
            throw new DuplicateComboException("Combo with same reference or name already exists.");
        }
        Set<SoldProduct> soldProducts = fetchSoldProducts(combo.getSoldProducts());
        combo.setSoldProducts(soldProducts);
        combo.setCreatedAt(LocalDateTime.now());

        return comboRepository.save(combo);
    }

    @Override
    public Combo updateCombo(Integer id, Combo combo) throws ComboNotFoundException, DuplicateComboException {
        Optional<Combo> existingComboOptional = comboRepository.findById(id);
        if (!existingComboOptional.isPresent()) {
            throw new ComboNotFoundException("Combo with id " + id + " not found.");
        }
        Combo existingCombo = existingComboOptional.get();
        if (!existingCombo.getName().equals(combo.getName()) && comboRepository.findByName(combo.getName()) != null) {
            throw new DuplicateComboException("Combo with same name already exists.");
        }
        if (!existingCombo.getRef().equals(combo.getRef()) && comboRepository.findByRef(combo.getRef()) != null) {
            throw new DuplicateComboException("Combo with same reference already exists.");
        }
        existingCombo.setName(combo.getName());
        existingCombo.setRef(combo.getRef());
        existingCombo.setPrice(combo.getPrice());
        existingCombo.setCreatedAt(LocalDateTime.now());

        Set<SoldProduct> soldProducts = fetchSoldProducts(combo.getSoldProducts());
        existingCombo.setSoldProducts(soldProducts);

        return comboRepository.save(existingCombo);
    }

    private Set<SoldProduct> fetchSoldProducts(Set<SoldProduct> soldProducts) {
        Set<SoldProduct> fetchedSoldProducts = new HashSet<>();
        for (SoldProduct soldProduct : soldProducts) {
            SoldProduct existingSoldProduct = soldProductRepository.findById(soldProduct.getId()).orElseThrow(()-> new EntityNotFoundException("Sold product with the id : "+soldProduct.getId()+" does not exist"));
            if (existingSoldProduct != null) {
                fetchedSoldProducts.add(existingSoldProduct);
            }
        }
        return fetchedSoldProducts;
    }

    @Override
    public Combo getComboById(Integer id) throws ComboNotFoundException {
        return comboRepository.findById(id).orElseThrow(() -> new ComboNotFoundException("Combo with id " + id + " not found."));
    }

    private void addSoldProductsToCombo(Combo combo) {
        for (SoldProduct soldProduct : combo.getSoldProducts()) {
            SoldProduct existingSoldProduct = soldProductRepository.findById(soldProduct.getId()).orElse(null);
            if (existingSoldProduct != null) {
                combo.getSoldProducts().add(existingSoldProduct);
            }
        }
    }



    @Override
    public List<Combo> getAllCombosByEstablishmentId(Integer establishmentId) {
        return comboRepository.findAll().stream()
                .filter(combo -> combo.getSoldProducts().stream()
                        .findFirst() // Get any sold product
                        .map(soldProduct -> soldProduct.getCategory().getEstablishment().getId().equals(establishmentId))
                        .orElse(false))
                .collect(Collectors.toList());
    }





    @Override
    public void deleteCombo(Integer comboId) throws ComboNotFoundException {
        Optional<Combo> comboOptional = comboRepository.findById(comboId);
        if (comboOptional.isPresent()) {
            Combo combo = comboOptional.get();
            comboRepository.delete(combo);
        } else {
            throw new ComboNotFoundException("Combo not found with ID: " + comboId);
        }
    }

}
