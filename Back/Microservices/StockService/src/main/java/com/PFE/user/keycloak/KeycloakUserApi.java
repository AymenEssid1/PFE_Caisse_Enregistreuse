package com.PFE.user.keycloak;


import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RolesResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.PFE.user.UserRegistrationRecord;
import com.PFE.user.keycloak.KeycloakUserService;

import java.security.Principal;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
@Slf4j
public class KeycloakUserApi {


    private final KeycloakUserService keycloakUserService;


    @PostMapping
    public UserRegistrationRecord createUser(@RequestBody UserRegistrationRecord userRegistrationRecord) {

        return keycloakUserService.createUser(userRegistrationRecord);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserRepresentation> getUserById(@PathVariable("userId") String userId) {
        try {
            UserRepresentation user = keycloakUserService.getUserById(userId);

            if (user != null) {
                return new ResponseEntity<>(user, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            // Handle exceptions appropriately (e.g., log and return an error response)
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all")
    public List<UserRepresentation> getAllUsers() {
        return keycloakUserService.getAllUsers();
    }

    @DeleteMapping("/{userId}")
    public void deleteUserById(@PathVariable("userId") String userId) {
        keycloakUserService.deleteUserById(userId);
    }


   /* @PutMapping("/{userId}/send-verify-email")
    public void sendVerificationEmail(@PathVariable String userId) {
        keycloakUserService.emailVerification(userId);
    }
    @PutMapping("/update-password")
    public void updatePassword(Principal principal) {
        keycloakUserService.updatePassword(principal.getName());
    }*/




}
