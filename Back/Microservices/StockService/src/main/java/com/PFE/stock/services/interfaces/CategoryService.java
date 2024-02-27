package com.PFE.stock.services.interfaces;

import com.PFE.stock.entities.Category;

import java.util.List;

public interface CategoryService {
    Category addCategory(Integer establishmentId, Category category);
    Category updateCategory(Integer categoryId, Category updatedCategory);
    void deleteCategory(Integer categoryId);
    List<Category> getAllCategories(Integer establishmentId);
}

