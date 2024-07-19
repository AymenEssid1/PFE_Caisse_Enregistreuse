package com.PFE.stock.controllers;


import com.PFE.stock.entities.Establishment;
import com.PFE.stock.entities.SoldProduct;
import com.PFE.stock.entities.StockEquivalent;
import com.PFE.stock.entities.image.IFileLocationService;
import com.PFE.stock.entities.image.Image;
import com.PFE.stock.repos.SoldProductRepository;
import com.PFE.stock.services.interfaces.SoldProductService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;

import java.util.List;

@RestController
@RequestMapping("/sold-products")
public class SoldProductController {

    private final SoldProductService soldProductService;
    private final IFileLocationService fileLocationService;


    public SoldProductController(SoldProductService soldProductService, IFileLocationService fileLocationService) {
        this.soldProductService = soldProductService;
        this.fileLocationService = fileLocationService;

    }

    @Autowired
    SoldProductRepository soldProductRepository;



    @PutMapping(value="/update-image/{spId}",consumes = "multipart/form-data")
    public ResponseEntity<SoldProduct> updateImage(@PathVariable("spId") Integer id, @RequestParam("image") MultipartFile file) {
        try {
            SoldProduct u =soldProductService.getById(id);
            System.out.println(u.getImage().getId());
            long imageId=u.getImage().getId();

            Image updatedImage = fileLocationService.update(imageId, file);
            return ResponseEntity.ok(u);
        } catch (EntityNotFoundException e){

            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }


        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping(value = "/addImagetoEstab/{spId}", consumes = "multipart/form-data")   //use @modelattribute maybe
    public ResponseEntity<SoldProduct> addImagetoEstab(@PathVariable("spId") Integer id,@RequestParam("image") MultipartFile image) {
        try {

            try {
                SoldProduct sp =soldProductService.getById(id);
                Image savedImageData = fileLocationService.save(image);
                sp.setImage(savedImageData);
                // Update other fields as needed
                soldProductRepository.save(sp);
                return ResponseEntity.ok(sp);
            } catch (EntityNotFoundException e){

                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping(value = "/image/{spId}")
    public ResponseEntity<FileSystemResource> downloadImage(@PathVariable("spId") Integer id) {
        try {
            SoldProduct sp =soldProductService.getById(id);
            FileSystemResource fileSystemResource = fileLocationService.find(sp.getImage().getId());
            return  ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(fileSystemResource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/add-sold-product/{establishmentId}")
    public ResponseEntity<Object> addSoldProduct(
            @PathVariable("establishmentId") Integer establishmentId,
            @RequestBody SoldProduct soldProduct
    ) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(soldProductService.addSoldProduct(establishmentId, soldProduct));
        } catch (EntityExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("le nom ou la reference existe deja");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Internal server error");
        }
    }

    @PutMapping("/update-sold-product/{id}/{establishmentId}")
    public ResponseEntity<Object> updateSoldProduct(
            @PathVariable("id") Integer soldProductId,
            @PathVariable("establishmentId") Integer establishmentId,
            @RequestBody SoldProduct updatedSoldProduct
    ) {
        try {
            SoldProduct result = soldProductService.updateSoldProduct(establishmentId,soldProductId, updatedSoldProduct);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produit introuvable");
        } catch (EntityExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("le nom ou la reference existe deja");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }


    @DeleteMapping("/delete-sold-product/{id}")
    public ResponseEntity<Void> deleteSoldProduct(@PathVariable("id") Integer soldProductId) {
        try {
            soldProductService.deleteSoldProduct(soldProductId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/establishments/{establishmentId}/sold-products")
    public Page<SoldProduct> getAllSoldProducts(
            @PathVariable Integer establishmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return soldProductService.getAllSoldProducts2(establishmentId, page, size);
    }


    @GetMapping("getby/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Integer id) {
        try{SoldProduct soldProduct = soldProductService.getById(id);

            return new ResponseEntity<>(soldProduct, HttpStatus.OK);
         }catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/searchByRef/{id}/{ref}")
    public ResponseEntity<?> getById(@PathVariable("id") Integer id,@PathVariable("ref") String ref) {
        try{SoldProduct soldProduct = soldProductService.findByRef(ref,id);

            return new ResponseEntity<>(soldProduct, HttpStatus.OK);
        }catch (EntityNotFoundException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
    }
}
