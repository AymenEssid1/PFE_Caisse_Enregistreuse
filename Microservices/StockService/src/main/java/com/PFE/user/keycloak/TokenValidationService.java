package com.PFE.user.keycloak;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class TokenValidationService {

    public boolean validateToken(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof Jwt)) {
            return false;
        }

        Jwt jwt = (Jwt) principal;

        // Here, you can perform additional validation if needed
        // For example, check the issuer, audience, expiration, etc.

        // If the token is valid, return true
        return true;
    }

    public String getUsername(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof Jwt)) {
            return null;
        }

        Jwt jwt = (Jwt) principal;

        // Extract and return the username from the JWT claims
        return jwt.getClaim("preferred_username");
    }

    public String getUserEmail(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof Jwt)) {
            return null;
        }

        Jwt jwt = (Jwt) principal;

        // Extract and return the user email from the JWT claims
        return jwt.getClaim("email");
    }
}
