package com.PFE.stock.controllers;


import com.PFE.stock.entities.Category;
import com.PFE.stock.services.interfaces.CategoryService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("/add-category/{establishmentId}")
    public ResponseEntity<Category> addCategory(
            @PathVariable("establishmentId") Integer establishmentId,
            @RequestBody Category category
    ) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.addCategory(establishmentId, category));
        } catch (EntityExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/update-category/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable("id") Integer categoryId,
            @RequestBody Category updatedCategory
    ) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(categoryService.updateCategory(categoryId, updatedCategory));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (EntityExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @DeleteMapping("/delete-category/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable("id") Integer categoryId) {
        try {
            categoryService.deleteCategory(categoryId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/get-all-categories/{establishmentId}")
    public ResponseEntity<List<Category>> getAllCategories(@PathVariable("establishmentId") Integer establishmentId) {
        return ResponseEntity.status(HttpStatus.OK).body(categoryService.getAllCategories(establishmentId));
    }
}
