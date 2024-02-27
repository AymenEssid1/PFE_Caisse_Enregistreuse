package com.PFE.stock.services.implementation;


import com.PFE.stock.entities.Category;
import com.PFE.stock.entities.Establishment;
import com.PFE.stock.repos.CategoryRepository;
import com.PFE.stock.repos.EstablishmentRepository;
import com.PFE.stock.services.interfaces.CategoryService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final EstablishmentRepository establishmentRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, EstablishmentRepository establishmentRepository) {
        this.categoryRepository = categoryRepository;
        this.establishmentRepository = establishmentRepository;
    }

    @Override
    public Category addCategory(Integer establishmentId, Category category) {
        Establishment establishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Establishment not found"));

        Optional<Category> existingCategory = categoryRepository.findByCategoryNameAndEstablishment(category.getCategoryName(), establishment);
        if (existingCategory.isPresent()) {
            throw new EntityExistsException("A category with this name already exists for the given establishment");
        }

        category.setEstablishment(establishment);
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Integer categoryId, Category updatedCategory) {
        Category existingCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        // Check if another category with the same name exists for the given establishment
        Optional<Category> categoryWithSameName = categoryRepository.findByCategoryNameAndEstablishment(updatedCategory.getCategoryName(), existingCategory.getEstablishment());
        if (categoryWithSameName.isPresent() && !categoryWithSameName.get().getId().equals(existingCategory.getId())) {
            throw new EntityExistsException("Another category with this name already exists for the given establishment");
        }

        existingCategory.setCategoryName(updatedCategory.getCategoryName());
        // Update other fields as needed
        return categoryRepository.save(existingCategory);
    }

    @Override
    public void deleteCategory(Integer categoryId) {
        categoryRepository.deleteById(categoryId);
    }

    @Override
    public List<Category> getAllCategories(Integer establishmentId) {
        Establishment establishment = establishmentRepository.findById(establishmentId)
                .orElseThrow(() -> new EntityNotFoundException("Establishment not found"));

        return categoryRepository.findByEstablishment(establishment);
    }
}
