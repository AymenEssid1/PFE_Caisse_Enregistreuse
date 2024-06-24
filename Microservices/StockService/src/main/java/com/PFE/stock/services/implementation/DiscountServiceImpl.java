package com.PFE.stock.services.implementation;

import com.PFE.stock.entities.Combo;
import com.PFE.stock.entities.SoldProduct;
import com.PFE.stock.entities.discount.Discount;
import com.PFE.stock.entities.discount.DiscountType;
import com.PFE.stock.repos.ComboRepository;
import com.PFE.stock.repos.DiscountRepository;
import com.PFE.stock.repos.SoldProductRepository;
import com.PFE.stock.services.interfaces.DiscountService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import com.fasterxml.jackson.core.type.TypeReference;

@Slf4j
@Service
public class DiscountServiceImpl implements DiscountService {

    @Autowired
    private DiscountRepository discountRepository;
    @Autowired
    private SoldProductRepository soldProductRepository;
    @Autowired
    private ComboRepository comboRepository;




    @Override
    public List<Discount> getAllDiscounts() {
        return discountRepository.findAll();
    }

    @Override
    public Discount getDiscountById(Integer id) {
        return discountRepository.findById(id).orElseThrow(()-> new EntityNotFoundException());
    }



    @Override
    public Discount createDiscount(Discount discount) {
        validateDiscount(discount);

        // Fetch sold products from the database and associate them with the discount
        if (discount.getSoldProducts() != null) {
            List<SoldProduct> managedSoldProducts = new ArrayList<>();
            for (SoldProduct soldProduct : discount.getSoldProducts()) {
                // Check if the sold product exists in the database
                if (soldProduct.getId() != null) {
                    SoldProduct managedSoldProduct = soldProductRepository.findById(soldProduct.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Sold product not found with ID: " + soldProduct.getId()));
                    managedSoldProduct.setDiscount(discount);
                    managedSoldProducts.add(managedSoldProduct);
                }
            }
            discount.setSoldProducts(managedSoldProducts);
        }


        // Fetch combos from the database and associate them with the discount
        if (discount.getCombos() != null) {
            List<Combo> managedCombos = new ArrayList<>();
            for (Combo combo : discount.getCombos()) {
                // Check if the combo exists in the database
                if (combo.getId() != null) {
                    Combo managedCombo = comboRepository.findById(combo.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Combo not found with ID: " + combo.getId()));
                    managedCombos.add(managedCombo);
                    managedCombo.setDiscount(discount);
                }
            }
            discount.setCombos(managedCombos);
        }

        return discountRepository.save(discount);
    }



    @Override
    public Discount updateDiscount(Integer discountId, Discount updatedDiscount) {
        Optional<Discount> optionalDiscount = discountRepository.findById(discountId);
        if (optionalDiscount.isPresent()) {
            Discount existingDiscount = optionalDiscount.get();
            validateDiscount(updatedDiscount);

            // Fetch sold products from the database and associate them with the updated discount
            if (updatedDiscount.getSoldProducts() != null) {
                List<SoldProduct> managedSoldProducts = new ArrayList<>();
                for (SoldProduct soldProduct : updatedDiscount.getSoldProducts()) {
                    // Check if the sold product exists in the database
                    if (soldProduct.getId() != null) {
                        SoldProduct managedSoldProduct = soldProductRepository.findById(soldProduct.getId())
                                .orElseThrow(() -> new IllegalArgumentException("Sold product not found with ID: " + soldProduct.getId()));
                        managedSoldProduct.setDiscount(updatedDiscount);
                        managedSoldProducts.add(managedSoldProduct);
                    }
                }
                updatedDiscount.setSoldProducts(managedSoldProducts);
            }

            // Fetch combos from the database and associate them with the updated discount
            if (updatedDiscount.getCombos() != null) {
                List<Combo> managedCombos = new ArrayList<>();
                for (Combo combo : updatedDiscount.getCombos()) {
                    // Check if the combo exists in the database
                    if (combo.getId() != null) {
                        Combo managedCombo = comboRepository.findById(combo.getId())
                                .orElseThrow(() -> new IllegalArgumentException("Combo not found with ID: " + combo.getId()));
                        managedCombo.setDiscount(updatedDiscount);
                        managedCombos.add(managedCombo);
                    }
                }
                updatedDiscount.setCombos(managedCombos);
            }

            // Remove discount association from removed sold products or combos
            removeDiscountFromRemovedEntities(existingDiscount, updatedDiscount);

            // Update other fields of the existing discount with the values from the updated discount
            existingDiscount.setPercentage(updatedDiscount.getPercentage());
            existingDiscount.setDiscountType(updatedDiscount.getDiscountType());
            existingDiscount.setBuyX(updatedDiscount.getBuyX());
            existingDiscount.setGetY(updatedDiscount.getGetY());
            existingDiscount.setStartTime(updatedDiscount.getStartTime());
            existingDiscount.setEndTime(updatedDiscount.getEndTime());

            return discountRepository.save(existingDiscount);
        } else {
            throw new IllegalArgumentException("Discount with ID " + discountId + " not found.");
        }
    }

    private void removeDiscountFromRemovedEntities(Discount existingDiscount, Discount updatedDiscount) {
        List<SoldProduct> removedSoldProducts = existingDiscount.getSoldProducts().stream()
                .filter(soldProduct -> !updatedDiscount.getSoldProducts().contains(soldProduct))
                .collect(Collectors.toList());

        List<Combo> removedCombos = existingDiscount.getCombos().stream()
                .filter(combo -> !updatedDiscount.getCombos().contains(combo))
                .collect(Collectors.toList());

        // Remove discount association from removed sold products
        for (SoldProduct soldProduct : removedSoldProducts) {
            soldProduct.setDiscount(null);
        }

        // Remove discount association from removed combos
        for (Combo combo : removedCombos) {
            combo.setDiscount(null);
        }
    }


    @Override
    public void deleteById(Integer discountId) {
        Optional<Discount> optionalDiscount = discountRepository.findById(discountId);
        if (optionalDiscount.isPresent()) {
            Discount discount = optionalDiscount.get();
            // Remove the association with sold products
            for (SoldProduct soldProduct : discount.getSoldProducts()) {
                soldProduct.setDiscount(null);
            }
            // Remove the association with combos
            for (Combo combo : discount.getCombos()) {
                combo.setDiscount(null);
            }
            // Save the changes
            discountRepository.deleteById(discountId);
        } else {
            throw new IllegalArgumentException("Discount not found with id: " + discountId);
        }
    }

    @Override
    public void deleteAll() {
        List<Discount> discounts = discountRepository.findAll();
        for (Discount discount : discounts) {
            // Remove the association with sold products
            for (SoldProduct soldProduct : discount.getSoldProducts()) {
                soldProduct.setDiscount(null);
            }
            // Remove the association with combos
            for (Combo combo : discount.getCombos()) {
                combo.setDiscount(null);
            }
        }
        // Delete all discounts
        discountRepository.deleteAll();
    }



    public void validateDiscount(Discount discount) {
        // Check if sold products or combos are associated with multiple discounts in the database
        List<SoldProduct> duplicatedSoldProducts = new ArrayList<>();
        List<Combo> duplicatedCombos = new ArrayList<>();

        for (SoldProduct soldProduct : discount.getSoldProducts()) {
            SoldProduct existingSoldProduct = soldProductRepository.findById(soldProduct.getId()).orElse(null);
            if (existingSoldProduct != null && existingSoldProduct.getDiscount() != null &&
                    !existingSoldProduct.getDiscount().getId().equals(discount.getId())) {
                duplicatedSoldProducts.add(existingSoldProduct);
            }
        }

        for (Combo combo : discount.getCombos()) {
            Combo existingCombo = comboRepository.findById(combo.getId()).orElse(null);
            if (existingCombo != null && existingCombo.getDiscount() != null &&
                    !existingCombo.getDiscount().getId().equals(discount.getId())) {
                duplicatedCombos.add(existingCombo);
            }
        }

        if (!duplicatedSoldProducts.isEmpty() || !duplicatedCombos.isEmpty()) {
            throw new IllegalArgumentException("Sold products or combos are already associated with another discount.");
        }



        if (discount.getDiscountType() == DiscountType.BUY_X_GET_Y && (discount.getBuyX() == null || discount.getGetY() == null)) {
            throw new IllegalArgumentException("Must specify buy X and get Y for buy X get Y discount.");
        }
    }





    @Override
    public List<Discount> getAllDiscountsByEstablishmentId(Integer establishmentId) {
        return discountRepository.findAll().stream()
                .filter(discount -> discount.getSoldProducts().stream()
                        .findFirst() // Get any sold product
                        .map(soldProduct -> soldProduct.getCategory().getEstablishment().getId().equals(establishmentId))
                        .orElse(false) ||
                        discount.getCombos().stream()
                                .findFirst() // Get any combo
                                .map(combo -> combo.getSoldProducts().stream()
                                        .findFirst() // Get any sold product associated with the combo
                                        .map(soldProduct -> soldProduct.getCategory().getEstablishment().getId().equals(establishmentId))
                                        .orElse(false))
                                .orElse(false))
                .collect(Collectors.toList());
    }



    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    private static final String SEND = "send";
    private static final String RECIEVE = "recieve";

  /*  @KafkaListener(topics = "send", groupId = "com.PFE")
    public void listenRequestDiscount(String message) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();

            // Parse the original message
            Map<String, Object> originalMessage = objectMapper.readValue(message, new TypeReference<Map<String, Object>>() {});

            // Extract the productId or comboId from the message
            Integer soldProductId = (Integer) originalMessage.get("soldProductId");
            Integer comboId = (Integer) originalMessage.get("comboId");
            int quantity =(int) originalMessage.get("quantity");
            System.out.println(" product ID " + soldProductId );
            System.out.println(" combo ID " + comboId );


            float calculatedPrice;
            // Construct the response message with the number and the original message content
            Map<String, Object> responseMessage = new HashMap<>();

            if (soldProductId != null) {
                // Fetch the SoldProduct with its associated discount
                SoldProduct existingSoldProduct = soldProductRepository.findById(soldProductId).orElse(null);

                if (existingSoldProduct != null ) {
                    if(existingSoldProduct.getDiscount() != null){
                        calculatedPrice=Calculate(existingSoldProduct.getDiscount(),quantity,existingSoldProduct.getPrice());
                        responseMessage.put("price", calculatedPrice); // Some number

                        // Convert the response message to JSON
                        String jsonResponseMessage = objectMapper.writeValueAsString(responseMessage);

                        // Send the JSON response message
                        kafkaTemplate.send(RECIEVE, jsonResponseMessage);
                    }else {
                        calculatedPrice=quantity*existingSoldProduct.getPrice();
                        responseMessage.put("price", calculatedPrice);

                        String jsonResponseMessage = objectMapper.writeValueAsString(responseMessage);

                        kafkaTemplate.send(RECIEVE, jsonResponseMessage);}


                }else {log.info("can't find the product");
                    responseMessage.put("price", -1); // Some number

                    // Convert the response message to JSON
                    String jsonResponseMessage = objectMapper.writeValueAsString(responseMessage);

                    // Send the JSON response message
                    kafkaTemplate.send(RECIEVE, jsonResponseMessage);
                }
            } else if (comboId != null) {
                Combo existingCombo = comboRepository.findById(comboId).orElse(null);
                if (existingCombo != null   ) {
                    if(existingCombo.getDiscount() != null){
                        calculatedPrice=Calculate(existingCombo.getDiscount(),quantity,existingCombo.getPrice());
                        responseMessage.put("price", calculatedPrice);

                        String jsonResponseMessage = objectMapper.writeValueAsString(responseMessage);

                        kafkaTemplate.send(RECIEVE, jsonResponseMessage);
                    }else {
                        calculatedPrice=quantity*existingCombo.getPrice();
                        responseMessage.put("price", calculatedPrice);

                        String jsonResponseMessage = objectMapper.writeValueAsString(responseMessage);

                        kafkaTemplate.send(RECIEVE, jsonResponseMessage);}


                }else {
                    log.info("can't find the combo");
                    responseMessage.put("price", -1); // Some number

                    // Convert the response message to JSON
                    String jsonResponseMessage = objectMapper.writeValueAsString(responseMessage);

                    // Send the JSON response message
                    kafkaTemplate.send(RECIEVE, jsonResponseMessage);}
            }



        } catch (Exception e) {

        }
    }


    private float Calculate(Discount discount, int quantity, float price) {
        // Check if the discount type is BUY_X_GET_Y and the current date is within the discount's validity period
        if (discount.getDiscountType() == DiscountType.BUY_X_GET_Y &&
                isWithinValidityPeriod(discount)) {
            int buyX = discount.getBuyX();
            int getY = discount.getGetY();

            // Calculate the number of times the discount applies
            int numberOfDiscountApplications = quantity / buyX; // Number of times the discount applies
            int freeItems = numberOfDiscountApplications * getY; // Number of free items based on the discount


            // Calculate the total price after discount
            float totalPriceAfterDiscount;
            if (quantity > buyX) {
                // Apply the discount if the quantity is equal to or greater than buyX
                 totalPriceAfterDiscount = (quantity - freeItems) * price;

            } else if (quantity == buyX) {
                totalPriceAfterDiscount= (quantity * price)-(getY *price);

            } else {
                // If quantity is less than buyX, no discount is applied
                totalPriceAfterDiscount = price * quantity;
            }
            System.out.println("price:   " + totalPriceAfterDiscount);
            return totalPriceAfterDiscount;
        } else if (discount.getDiscountType() == DiscountType.FLAT) {
            System.out.println("BOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOM");
            float totalPriceAfterDiscount;
            float discountPercentage = discount.getPercentage();
            float discountAmount = (discountPercentage / 100) * (quantity * price);
            totalPriceAfterDiscount = (quantity * price) - discountAmount;
            return totalPriceAfterDiscount;
        }




        else {
            // Return the original price if the discount is not applicable
            return price * quantity;
        }
    }


    // Helper method to check if the current date is within the discount's validity period
    private boolean isWithinValidityPeriod(Discount discount) {
        Date currentDate = new Date(); // Get the current date
        Date startDate = discount.getStartTime();
        Date endDate = discount.getEndTime();

        // Check if the current date is between the start and end dates
        return currentDate.after(startDate) && currentDate.before(endDate);
    }*/

    @KafkaListener(topics = SEND, groupId = "com.PFE")
    public void listenRequestDiscount(String message) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> originalMessage = objectMapper.readValue(message, new TypeReference<Map<String, Object>>() {});

            Integer soldProductId = (Integer) originalMessage.get("soldProductId");
            Integer comboId = (Integer) originalMessage.get("comboId");
            int quantity = (int) originalMessage.get("quantity");
            String requestId = (String) originalMessage.get("requestId");

            System.out.println("Product ID: " + soldProductId);
            System.out.println("Combo ID: " + comboId);

            float calculatedPrice;
            Map<String, Object> responseMessage = new HashMap<>();

            if (soldProductId != null) {
                SoldProduct existingSoldProduct = soldProductRepository.findById(soldProductId).orElse(null);
                if (existingSoldProduct != null) {
                    if (existingSoldProduct.getDiscount() != null) {
                        calculatedPrice = Calculate(existingSoldProduct.getDiscount(), quantity, existingSoldProduct.getPrice());
                    } else {
                        calculatedPrice = quantity * existingSoldProduct.getPrice();
                    }
                    responseMessage.put("price", calculatedPrice);
                } else {
                    log.info("Can't find the product");
                    responseMessage.put("price", -1);
                }
            } else if (comboId != null) {
                Combo existingCombo = comboRepository.findById(comboId).orElse(null);
                if (existingCombo != null) {
                    if (existingCombo.getDiscount() != null) {
                        calculatedPrice = Calculate(existingCombo.getDiscount(), quantity, existingCombo.getPrice());
                    } else {
                        calculatedPrice = quantity * existingCombo.getPrice();
                    }
                    responseMessage.put("price", calculatedPrice);
                } else {
                    log.info("Can't find the combo");
                    responseMessage.put("price", -1);
                }
            }

            responseMessage.put("requestId", requestId);
            String jsonResponseMessage = objectMapper.writeValueAsString(responseMessage);
            kafkaTemplate.send(RECIEVE, jsonResponseMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private float Calculate(Discount discount, int quantity, float price) {
        if (discount.getDiscountType() == DiscountType.BUY_X_GET_Y && isWithinValidityPeriod(discount)) {
            int buyX = discount.getBuyX();
            int getY = discount.getGetY();
            int numberOfDiscountApplications = quantity / buyX;
            int freeItems = numberOfDiscountApplications * getY;

            float totalPriceAfterDiscount;
            if (quantity > buyX) {
                totalPriceAfterDiscount = (quantity - freeItems) * price;
            } else if (quantity == buyX) {
                totalPriceAfterDiscount = (quantity * price) - (getY * price);
            } else {
                totalPriceAfterDiscount = price * quantity;
            }
            System.out.println("Price: " + totalPriceAfterDiscount);
            return totalPriceAfterDiscount;
        } else if (discount.getDiscountType() == DiscountType.FLAT) {
            float discountPercentage = discount.getPercentage();
            float discountAmount = (discountPercentage / 100) * (quantity * price);
            return (quantity * price) - discountAmount;
        } else {
            return price * quantity;
        }
    }

    private boolean isWithinValidityPeriod(Discount discount) {
        Date currentDate = new Date();
        Date startDate = discount.getStartTime();
        Date endDate = discount.getEndTime();
        return currentDate.after(startDate) && currentDate.before(endDate);
    }





}
