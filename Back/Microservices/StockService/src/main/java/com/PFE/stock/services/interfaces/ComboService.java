package com.PFE.stock.services.interfaces;

import com.PFE.stock.entities.Combo;

import java.util.List;

public interface ComboService {
    Combo addCombo(Integer establishmentId, Combo combo);
   // Combo updateCombo(Integer establishmentId, Integer comboId, Combo updatedCombo);
    void deleteCombo(Integer comboId);
    List<Combo> getAllCombos(Integer establishmentId);
    Combo getComboById(Integer comboId);
}
