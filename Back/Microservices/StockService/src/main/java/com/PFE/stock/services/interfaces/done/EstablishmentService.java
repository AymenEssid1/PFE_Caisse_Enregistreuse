package com.PFE.stock.services.interfaces.done;

import com.PFE.stock.entities.Establishment;

import java.util.List;

public interface EstablishmentService {
    Establishment addEstablishment(Establishment establishment);
    Establishment updateEstablishment(Integer establishmentId, Establishment updatedEstablishment);
    void deleteEstablishment(Integer establishmentId);
    List<Establishment> getAllEstablishments();
}