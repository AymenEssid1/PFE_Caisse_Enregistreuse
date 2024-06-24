package com.PFE.stock.services.implementation;

import com.PFE.stock.entities.Category;
import com.PFE.stock.entities.Establishment;
import com.PFE.stock.entities.Tables;
import com.PFE.stock.repos.TablesRepository;
import com.PFE.stock.services.interfaces.TablesService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class TablesServiceImpl implements TablesService {


    @Autowired
    private TablesRepository tablesRepository;

    @Override
    public Tables createTable(Tables table) {

        return tablesRepository.save(table);
    }

    @Override
    public void deleteTable(Integer tableId) {
        tablesRepository.deleteById(tableId);
    }


    @Override
    public Tables getbyId(Integer tableId) {
         return tablesRepository.findById(tableId).orElseThrow(()-> new EntityNotFoundException());
    }

    @Override
    public Tables adjustTableStatus(Integer tableId, Boolean newStatus) {
        Tables table = tablesRepository.findById(tableId).orElseThrow(() -> new EntityNotFoundException("Table not found"));
        table.setStatus(newStatus);
        return tablesRepository.save(table);
    }

    @Override
    public Tables editTableName(Integer tableId, String newName) {
        Tables table = tablesRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Table not found"));
        table.setName(newName);
        return tablesRepository.save(table);
    }

    @Override
    public List<Tables> getTablesByEstablishmentId(Integer establishmentId) {
        return tablesRepository.findByEstablishmentId(establishmentId);
    }


}
