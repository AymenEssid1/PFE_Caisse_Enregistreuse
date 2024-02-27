package com.PFE.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.media.Schema;

@OpenAPIDefinition(
        info = @Info(
                contact = @Contact(
                        name = "Aymen",
                        email = "aymen.essid@esprit.tn"
                )
        ),
        servers = {
                @Server(
                        description = "this is the microservice for stock management",
                        url = "http://localhost:8080"
                ),
        }

)

public class OpenApiConfig {



}