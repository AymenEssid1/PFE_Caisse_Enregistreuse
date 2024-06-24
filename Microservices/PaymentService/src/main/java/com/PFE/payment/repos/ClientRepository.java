package com.PFE.payment.repos;

import com.PFE.payment.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Integer> {


    boolean existsByEmailAndEstablishmentId(String email, Integer establishmentId);

    boolean existsByPhoneAndEstablishmentId(String email, Integer establishmentId);

    List<Client> findAllByEstablishmentId(Integer establishmentId);


    Optional<Client> findByEmailAndEstablishmentId(String email, Integer establishmentId);

    Optional<Client> findByPhoneAndEstablishmentId(String phoneNumber, Integer establishmentId);
}