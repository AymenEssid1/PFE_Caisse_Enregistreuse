package com.PFE.stock.services.interfaces;

import com.PFE.stock.entities.Tables;

import java.util.List;

public interface TablesService {

    Tables createTable(Tables table);
    void deleteTable(Integer tableId);
    Tables adjustTableStatus(Integer tableId, Boolean newStatus);
    Tables editTableName(Integer tableId, String newName);
    List<Tables> getTablesByEstablishmentId(Integer establishmentId);

}
