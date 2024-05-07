package com.PFE.order.controllers;


import com.PFE.order.entities.Item;
import com.PFE.order.services.service.ItemService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Item")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @PostMapping("/add")
    public Item createItem(@RequestBody Item item) {
        return itemService.createItem(item);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable("id") Integer id, @RequestBody Item item) {
        Item updatedItem = itemService.updateItem(id, item);
        if (updatedItem == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedItem);
    }


    @GetMapping("/getby/{id}")
    public ResponseEntity<?> getItemById(@PathVariable("id") Integer id) {

        try{
        Item item = itemService.getItemById(id);

            return new ResponseEntity<>(item, HttpStatus.OK);
        }
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);


        }
    }



    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable("id") Integer id) {
        try {itemService.deleteItem(id);
        return new ResponseEntity<>( HttpStatus.NO_CONTENT);}
        catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);


        }
    }



    @GetMapping("/getAll")
    public ResponseEntity<List<Item>> getAllItems() {
        List<Item> items = itemService.getAllItems();
        return ResponseEntity.ok(items);
    }

    @DeleteMapping("/deleteAll")
    public ResponseEntity<Void> deleteAllItems() {
        itemService.deleteAllItems();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/deleteList")
    public ResponseEntity<?> deleteItems(@RequestBody List<Integer> itemIds) {
        try {
            itemService.deleteItemsByIds(itemIds);

            return new ResponseEntity<>( HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


}
