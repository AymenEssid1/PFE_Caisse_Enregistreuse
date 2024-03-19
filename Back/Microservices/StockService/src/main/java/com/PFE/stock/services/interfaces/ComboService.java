package com.PFE.stock.services.interfaces;

import com.PFE.stock.entities.Combo;
import com.PFE.stock.services.Exceptions.ComboNotFoundException;
import com.PFE.stock.services.Exceptions.DuplicateComboException;

import java.util.List;

public interface ComboService {
    Combo createCombo(Combo combo) throws DuplicateComboException;
    Combo updateCombo(Integer id, Combo combo) throws ComboNotFoundException, DuplicateComboException;
    Combo getComboById(Integer id) throws ComboNotFoundException;
    List<Combo> getAllCombosByEstablishmentId(Integer establishmentId);
    public void deleteCombo(Integer comboId) throws ComboNotFoundException;;
}
