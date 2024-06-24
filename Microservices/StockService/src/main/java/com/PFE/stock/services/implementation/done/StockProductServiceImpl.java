package com.PFE.stock.services.implementation.done;

import com.PFE.stock.entities.*;
import com.PFE.stock.repos.*;
import com.PFE.stock.services.interfaces.done.StockProductService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.type.TypeReference;



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
        existingStockProduct.setUnit(updatedStockProduct.getUnit());
        existingStockProduct.setLowStockAlert(updatedStockProduct.getLowStockAlert());

        StockProduct sp = stockProductRepository.save(existingStockProduct);

        updateSoldProductsStatus(establishmentId);

        return sp;
    }



    @Transactional
    public void updateSoldProductsStatus(Integer establishmentId) {
        Establishment establishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Establishment not found"));

        List<SoldProduct> soldProducts = soldProductRepository.findAllByCategoryEstablishment(establishment);

        for (SoldProduct soldProduct : soldProducts) {
            boolean shouldSetStatusToTrue = false;

            for (StockEquivalent stockEquivalent : soldProduct.getStockEquivalents()) {
                if (stockEquivalent.getStockproduct().getQuantity() < stockEquivalent.getQuantity()) {
                    shouldSetStatusToTrue = true;
                    break;
                }
            }

            soldProduct.setStatus(shouldSetStatusToTrue);
            soldProductRepository.save(soldProduct);
        }

        updateComboStatus();
    }

    @Transactional
    public void updateComboStatus() {
        List<Combo> combos = comboRepository.findAll();

        for (Combo combo : combos) {

            boolean shouldSetStatusToTrue = false;
            for(SoldProduct sp :combo.getSoldProducts()){
                System.out.println("aaa"+sp.getName()+"   "+sp.isStatus());
                if(sp.isStatus()==true){
                    shouldSetStatusToTrue=true;
                    break;
                }
            }

                combo.setStatus(shouldSetStatusToTrue);
                comboRepository.save(combo);

        }
    }






    @Scheduled(fixedRate = 600000)
    public void checkStockLevels() {
        List<Establishment> establishments = establishmentRepository.findAll();

        establishments.forEach(establishment -> {
            List<StockProduct> lowStockProducts = establishment.getStockProducts().stream()
                    .filter(stockProduct -> stockProduct.getQuantity() <= stockProduct.getLowStockAlert())
                    .collect(Collectors.toList());

            if (!lowStockProducts.isEmpty()) {
                sendLowStockNotification(establishment, lowStockProducts);
            }
        });
    }

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    private static final String TOPIC = "notification";

    private void sendLowStockNotification(Establishment establishment, List<StockProduct> lowStockProducts) {
        String requestId = UUID.randomUUID().toString();

        Map<String, Object> message = new HashMap<>();
        message.put("requestId", requestId);
        message.put("establishmentId", establishment.getId());
        message.put("establishmentName", establishment.getName());
        message.put("lowStockProducts", lowStockProducts.stream()
                .map(StockProduct::getName)
                .collect(Collectors.toList()));

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonMessage = objectMapper.writeValueAsString(message);
            kafkaTemplate.send(TOPIC, jsonMessage);
        } catch (JsonProcessingException e) {
            System.out.println("Failed to send message: " + e.getMessage());
        }
    }

@Autowired
    StockEquivalentRepository stockEquivalentRepository;
    @Override
    @Transactional
    public void deleteStockProduct(Integer stockProductId) {
        StockProduct stockProduct = stockProductRepository.findById(stockProductId)
                .orElseThrow(() -> new EntityNotFoundException("StockProduct not found with id: " + stockProductId));

        List<SoldProduct> soldProductsToDelete = new ArrayList<>();
        List<StockEquivalent> stockEquivalents = stockEquivalentRepository.findByStockproduct(stockProduct);
        // Step 1: Delete StockEquivalents associated with the StockProduct
        for (StockEquivalent stockEquivalent : stockEquivalents) {

            soldProductsToDelete = soldProductRepository.findByStockEquivalents_Id(stockEquivalent.getId());

            stockEquivalentRepository.deleteById(stockEquivalent.getId());
        }


        // Step 3: Delete SoldProducts and their related Combos
        for (SoldProduct soldProduct : soldProductsToDelete) {
            // Fetch SoldProduct from database to ensure it's managed
            SoldProduct dbSoldProduct = soldProductRepository.findById(soldProduct.getId())
                    .orElseThrow(() -> new EntityNotFoundException("SoldProduct not found with id: " + soldProduct.getId()));

            // Fetch all combos that contain the soldProduct
            List<Combo> combosToDelete = comboRepository.findBySoldProduct(dbSoldProduct);

            // Remove the soldProduct from combos
            for (Combo combo : combosToDelete) {
                combo.getSoldProducts().remove(dbSoldProduct);
                comboRepository.save(combo); // Update the combo without the soldProduct
            }

            // Delete the combos
            comboRepository.deleteAll(combosToDelete);

            // Delete the soldProduct
            soldProductRepository.delete(dbSoldProduct);
        }

        // Step 4: Delete the StockProduct itself
        stockProductRepository.delete(stockProduct);
    }

    @Override
    public List<StockProduct> getAllStockProducts(Integer establishmentId) {
        Establishment establishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Establishment not found"));

        return stockProductRepository.findByEstablishment(establishment);
    }

    @Override
    public StockProduct getById(Integer stockpid) {
        return stockProductRepository.findById(stockpid).orElseThrow(()->new EntityNotFoundException("produit de stock introuvable"));
    }




    @Autowired
    SoldProductRepository soldProductRepository;

    @Autowired
    ComboRepository comboRepository;


    @KafkaListener(topics = "stockreduction", groupId = "com.PFE")
    public void listenStockReductionMessage(String jsonMessage) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> message = objectMapper.readValue(jsonMessage, new TypeReference<Map<String, Object>>() {});

            String requestId = (String) message.get("requestId");
            List<ItemDTO> orderItems = objectMapper.convertValue(message.get("orderItems"), new TypeReference<List<ItemDTO>>() {});

            // Process the order items
            for (ItemDTO item : orderItems) {
                try {
                    if (item.getSoldProductId() != null) {
                        reduceStockForSoldProduct(item);
                    } else if (item.getComboId() != null) {
                        reduceStockForCombo(item);
                    } else {
                        System.out.println("Invalid item: neither soldProductId nor comboId is set.");
                    }
                } catch (EntityNotFoundException e) {
                    System.out.println("Failed to process item with ID " + item.getId() + ": " + e.getMessage());
                    // Continue processing the rest of the items
                }
            }
        } catch (Exception e) {
            System.out.println("Failed to process stock reduction message: " + e.getMessage());
        }
    }



    private void reduceStockForSoldProduct(ItemDTO item) {
        SoldProduct soldProduct = soldProductRepository.findByIdWithStockEquivalents(item.getSoldProductId())
                .orElseThrow(() -> new EntityNotFoundException("SoldProduct not found"));

        for (StockEquivalent stockEquivalent : soldProduct.getStockEquivalents()) {
            StockProduct stockProduct = stockEquivalent.getStockproduct();
            float reductionAmount = stockEquivalent.getQuantity() * item.getQuantity();



            float newQuant =stockProduct.getQuantity() - reductionAmount;

            stockProduct.setQuantity(newQuant);
            stockProductRepository.save(stockProduct);

            if(newQuant < stockEquivalent.getQuantity()){
                soldProduct.setStatus(true);
                soldProductRepository.save(soldProduct);
            }

        }
    }



    private void reduceStockForCombo(ItemDTO item) {
        Combo combo = comboRepository.findByIdWithSoldProducts(item.getComboId())
                .orElseThrow(() -> new EntityNotFoundException("Combo not found"));

        for (SoldProduct soldProduct1 : combo.getSoldProducts()) {

            SoldProduct soldProduct = soldProductRepository.findByIdWithStockEquivalents(soldProduct1.getId())
                    .orElseThrow(() -> new EntityNotFoundException("SoldProduct not found"));
            for (StockEquivalent stockEquivalent : soldProduct.getStockEquivalents()) {
                StockProduct stockProduct = stockEquivalent.getStockproduct();
                float reductionAmount = stockEquivalent.getQuantity() * item.getQuantity();

                 float newQuant =stockProduct.getQuantity() - reductionAmount;

                stockProduct.setQuantity(newQuant);
                stockProductRepository.save(stockProduct);

                if(newQuant < stockEquivalent.getQuantity()){
                    combo.setStatus(true);
                    comboRepository.save(combo);
                }
            }
        }
    }



    @Override
    public boolean checkStockAvailability(List<StockEquivalent> stockEquivalents, float quantity) {
        for (StockEquivalent stockEquivalent : stockEquivalents) {
            StockProduct stockProduct = stockProductRepository.findById(stockEquivalent.getStockproduct().getId()).orElseThrow(()->new EntityNotFoundException());
            if (stockProduct.getQuantity() < quantity * stockEquivalent.getQuantity()) {
                return false;
            }
        }
        return true;
    }


}
