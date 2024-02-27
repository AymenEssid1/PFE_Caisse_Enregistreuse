package com.PFE.stock.services.implementation.done;

import com.PFE.stock.entities.Establishment;
import com.PFE.stock.entities.StockProduct;
import com.PFE.stock.repos.EstablishmentRepository;
import com.PFE.stock.repos.StockProductRepository;
import com.PFE.stock.services.interfaces.done.StockProductService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class StockProductServiceImpl implements StockProductService {

    private final StockProductRepository stockProductRepository;
    private final EstablishmentRepository establishmentRepository;

    public StockProductServiceImpl(StockProductRepository stockProductRepository, EstablishmentRepository establishmentRepository) {
        this.stockProductRepository = stockProductRepository;
        this.establishmentRepository = establishmentRepository;
    }

    @Override
    public StockProduct addStockProduct(Integer establishmentId, StockProduct stockProduct) {
        Establishment establishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Establishment not found"));

        // Check if another stock product with the same name or refstock exists for the given establishment
        Optional<StockProduct> existingByName = stockProductRepository.findByNameAndEstablishment(stockProduct.getName(), establishment);
        Optional<StockProduct> existingByRefstock = stockProductRepository.findByRefstockAndEstablishment(stockProduct.getRefstock(), establishment);

        if (existingByName.isPresent() || existingByRefstock.isPresent()) {
            throw new EntityExistsException("A stock product with this name or refstock already exists for the given establishment");
        }

        stockProduct.setEstablishment(establishment);
        return stockProductRepository.save(stockProduct);
    }

    @Override
    public StockProduct updateStockProduct(Integer establishmentId, Integer stockProductId, StockProduct updatedStockProduct) {
        Establishment establishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Establishment not found"));

        StockProduct existingStockProduct = stockProductRepository.findById(stockProductId)
                .orElseThrow(() -> new EntityNotFoundException("Stock Product not found"));

        // Check if another stock product with the same name or refstock exists for the given establishment
        Optional<StockProduct> stockProductWithSameName = stockProductRepository.findByNameAndEstablishment(updatedStockProduct.getName(), establishment);
        Optional<StockProduct> stockProductWithSameRefstock = stockProductRepository.findByRefstockAndEstablishment(updatedStockProduct.getRefstock(), establishment);

        if ((stockProductWithSameName.isPresent() && !stockProductWithSameName.get().getId().equals(existingStockProduct.getId())) ||
                (stockProductWithSameRefstock.isPresent() && !stockProductWithSameRefstock.get().getId().equals(existingStockProduct.getId()))) {
            throw new EntityExistsException("Another stock product with this name or refstock already exists for the given establishment");
        }

        existingStockProduct.setName(updatedStockProduct.getName());
        existingStockProduct.setRefstock(updatedStockProduct.getRefstock());
        existingStockProduct.setQuantity(updatedStockProduct.getQuantity());
        // Update other fields as needed
        return stockProductRepository.save(existingStockProduct);
    }

    @Override
    public void deleteStockProduct(Integer stockProductId) {
        stockProductRepository.deleteById(stockProductId);
    }

    @Override
    public List<StockProduct> getAllStockProducts(Integer establishmentId) {
        Establishment establishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Establishment not found"));

        return stockProductRepository.findByEstablishment(establishment);
    }
}
