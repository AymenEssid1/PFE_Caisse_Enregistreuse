package com.PFE.stock.services.implementation;

import com.PFE.stock.repos.ComboRepository;
import com.PFE.stock.services.interfaces.ComboService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class ComboServiceImpl implements ComboService {

    @Autowired
    private ComboRepository comborepo;
}
