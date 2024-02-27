package com.PFE.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info = @Info(
                contact = @Contact(
                        name = "Aymen",
                        email = "aymen.essid@esprit.tn"
                )
        ),
        servers = {
                @Server(
                        description = "this is the microservice for ORDER management",
                        url = "http://localhost:8081"
                ),
        }

)

public class OpenApiConfig {



}