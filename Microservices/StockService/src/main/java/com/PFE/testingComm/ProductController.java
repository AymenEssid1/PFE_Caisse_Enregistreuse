package com.PFE.testingComm;

import com.PFE.kafka.ProductEventProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    private ProductEventProducer productEventProducer;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Optional<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }


    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product)  {
        Product createdProduct = productService.saveProduct(product);

        // Send Kafka event when a new product is created
        productEventProducer.sendProductEvent(createdProduct);

        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }


    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}
