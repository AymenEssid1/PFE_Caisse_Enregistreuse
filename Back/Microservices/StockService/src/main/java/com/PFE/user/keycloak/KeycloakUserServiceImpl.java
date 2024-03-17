package com.PFE.user.keycloak;


import com.PFE.user.UserRegistrationRecord;
import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@Slf4j
public class KeycloakUserServiceImpl implements KeycloakUserService{

    @Value("${keycloak.realm}")
    private String realm;
    private Keycloak keycloak;



    public KeycloakUserServiceImpl(Keycloak keycloak) {
        this.keycloak = keycloak;
    }




    @Override
    public UserRegistrationRecord createUser(UserRegistrationRecord userRegistrationRecord) {

        UserRepresentation user=new UserRepresentation();
        user.setEnabled(true);
        user.setUsername(userRegistrationRecord.username());
        user.setEmail(userRegistrationRecord.email());
        user.setFirstName(userRegistrationRecord.firstName());
        user.setLastName(userRegistrationRecord.lastName());
        user.setEmailVerified(true);

        CredentialRepresentation credentialRepresentation=new CredentialRepresentation();
        credentialRepresentation.setValue(userRegistrationRecord.password());
        credentialRepresentation.setTemporary(false);
        credentialRepresentation.setType(CredentialRepresentation.PASSWORD);

        List<CredentialRepresentation> list = new ArrayList<>();
        list.add(credentialRepresentation);
        user.setCredentials(list);

        UsersResource usersResource = getUsersResource();

        Response response = usersResource.create(user);

        if(Objects.equals(201,response.getStatus())){

            List<UserRepresentation> representationList = usersResource.searchByUsername(userRegistrationRecord.username(), true);
           /* if(!CollectionUtils.isEmpty(representationList)){
                UserRepresentation userRepresentation1 = representationList.stream().filter(userRepresentation -> Objects.equals(false, userRepresentation.isEmailVerified())).findFirst().orElse(null);
                assert userRepresentation1 != null;
                emailVerification(userRepresentation1.getId());
            }*/
            return  userRegistrationRecord;
        }

        //response.readEntity();

        return null;
    }

    private UsersResource getUsersResource() {
        RealmResource realm1 = keycloak.realm(realm);
        return realm1.users();
    }

    @Override
    public List<UserRepresentation> getAllUsers() {
        UsersResource usersResource = getUsersResource();
        return usersResource.list();
    }

    @Override
    public UserRepresentation getUserById(String userId) {
        UsersResource usersResource = getUsersResource();
        UserResource userResource = usersResource.get(userId);
        UserRepresentation userRepresentation =userResource.toRepresentation();
        List<RoleRepresentation> roles = userResource.roles().realmLevel().listAll();

        String roless="";

        if (CollectionUtils.isEmpty(roles)) {
            log.info("No roles found for user with ID: {}", userId);
        } else {
            log.info("Roles for user with ID {}:", userId);
            for (RoleRepresentation role : roles) {
                roless =roless+ role.getName();
                // You can log additional details about the role if needed
            }
        }
        log.info("Roles: {}", roless);
        return userRepresentation;
    }

    @Override
    public void deleteUserById(String userId) {

        getUsersResource().delete(userId);
    }


    @Override
    public void emailVerification(String userId){

        UsersResource usersResource = getUsersResource();
        usersResource.get(userId).sendVerifyEmail();
    }

    public UserResource getUserResource(String userId){
        UsersResource usersResource = getUsersResource();
        return usersResource.get(userId);
    }

    @Override
    public void updatePassword(String userId) {

        UserResource userResource = getUserResource(userId);
        List<String> actions= new ArrayList<>();
        actions.add("UPDATE_PASSWORD");
        userResource.executeActionsEmail(actions);

    }
}
