package com.PFE.stock.entities.image;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.webjars.NotFoundException;

@Service
public class FileLocationService implements IFileLocationService {


    @Autowired
    FileSystemRepository fileSystemRepository;
    @Autowired
    ImageRepository imageDataRepository;


    public Image save(MultipartFile file) throws Exception {
        String location = fileSystemRepository.save(file);
        return imageDataRepository.save(new Image(file.getOriginalFilename(), location));
    }

    public Image update(Long imageId, MultipartFile file) throws Exception {
        // Retrieve the existing image from the repository
        Image existingImage = imageDataRepository.findById(imageId)
                .orElseThrow(() -> new NotFoundException("Image not found"));

        // Update the image's location with the new file
        String newLocation = fileSystemRepository.save(file);

        // Update the image's details
        existingImage.setName(file.getOriginalFilename());
        existingImage.setLocation(newLocation);

        // Save the updated image
        return imageDataRepository.save(existingImage);
    }

    public FileSystemResource find(Long imageId) {
        Image image = imageDataRepository.findById(imageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return fileSystemRepository.findInFileSystem(image.getLocation());
    }


}
