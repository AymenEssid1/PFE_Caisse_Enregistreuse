package com.PFE.stock.controllers.done;


import com.PFE.stock.entities.Establishment;
import com.PFE.stock.entities.image.FileLocationService;
import com.PFE.stock.entities.image.IFileLocationService;
import com.PFE.stock.entities.image.Image;
import com.PFE.stock.repos.EstablishmentRepository;
import com.PFE.stock.services.interfaces.done.EstablishmentService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

//@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/establishments")
public class EstablishmentController {

    private final EstablishmentService establishmentService;
    private final IFileLocationService fileLocationService;


    public EstablishmentController(EstablishmentService establishmentService, IFileLocationService fileLocationService) {
        this.establishmentService = establishmentService;
        this.fileLocationService = fileLocationService;
    }
    @Autowired
    private EstablishmentRepository establishmentRepository;

    @PutMapping(value="/update-image/{estabId}",consumes = "multipart/form-data")
    public ResponseEntity<Establishment> updateImage(@PathVariable("estabId") Integer id, @RequestParam("image") MultipartFile file) {
        try {
            Establishment u =establishmentService.getById(id);
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


    @PostMapping(value = "/addImagetoEstab/{estabId}", consumes = "multipart/form-data")   //use @modelattribute maybe
    public ResponseEntity<Establishment> addImagetoEstab(@PathVariable("estabId") Integer id,@RequestParam("image") MultipartFile image) {
        try {

            try {
                Establishment existingEstablishment =establishmentService.getById(id);
                Image savedImageData = fileLocationService.save(image);
                existingEstablishment.setImage(savedImageData);
                // Update other fields as needed
                establishmentRepository.save(existingEstablishment);
                return ResponseEntity.ok(existingEstablishment);
            } catch (EntityNotFoundException e){

                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping(value = "/image/{estabId}")
    public ResponseEntity<FileSystemResource> downloadImage(@PathVariable("estabId") Integer id) {
        try {
            Establishment existingEstablishment =establishmentService.getById(id);
            FileSystemResource fileSystemResource = fileLocationService.find(existingEstablishment.getImage().getId());
            return  ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(fileSystemResource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(value = "/estab/{estabId}")
    public ResponseEntity<Establishment> getbyId(@PathVariable("estabId") Integer id) {
        try {
            Establishment existingEstablishment =establishmentService.getById(id);
            return  ResponseEntity.ok(existingEstablishment);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

//voxw rwko ouhv xchn

    @PostMapping("/add-establishment")
    public ResponseEntity<Establishment> addEstablishment(@RequestBody Establishment establishment) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(establishmentService.addEstablishment(establishment));
        } catch (EntityExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PutMapping("/update-establishment/{id}")
    public ResponseEntity<Establishment> updateEstablishment(
            @PathVariable("id") Integer establishmentId,
            @RequestBody Establishment updatedEstablishment
    ) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(establishmentService.updateEstablishment(establishmentId, updatedEstablishment));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (EntityExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @DeleteMapping("/delete-establishment/{id}")
    public ResponseEntity<Void> deleteEstablishment(@PathVariable("id") Integer establishmentId) {
        try {
            establishmentService.deleteEstablishment(establishmentId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/get-all-establishments")
    public ResponseEntity<List<Establishment>> getAllEstablishments() {
        return ResponseEntity.status(HttpStatus.OK).body(establishmentService.getAllEstablishments());
    }
}
