package com.PFE;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/helloo")
public class HelloController {

    @GetMapping
    public String sayHello() {
        return "Hello, World from Stock Service!";
    }
}
