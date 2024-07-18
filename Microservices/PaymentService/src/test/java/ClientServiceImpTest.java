import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.PFE.payment.entities.Client;
import com.PFE.payment.repos.ClientRepository;
import com.PFE.payment.services.implementation.ClientServiceImp;

public class ClientServiceImpTest {

    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private ClientServiceImp clientService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllClients() {
        // Mock data
        List<Client> clients = Arrays.asList(new Client(), new Client());

        // Mock repository behavior
        when(clientRepository.findAll()).thenReturn(clients);

        // Call service method
        List<Client> result = clientService.getAllClients();

        // Verify result
        assertEquals(2, result.size());
    }


    @Test
    public void testGetAllClientsByEstablishmentId() {
        // Mock data and input
        Integer establishmentId = 1;
        List<Client> clients = Arrays.asList(new Client(), new Client());

        // Mock repository behavior
        when(clientRepository.findAllByEstablishmentId(establishmentId)).thenReturn(clients);

        // Call service method
        List<Client> result = clientService.getAllClients(establishmentId);

        // Verify result
        assertEquals(2, result.size());
    }


    @Test
    public void testGetClientById() {
        // Mock data and input
        Integer clientId = 1;
        Client client = new Client();
        client.setId(clientId);

        // Mock repository behavior
        when(clientRepository.findById(clientId)).thenReturn(Optional.of(client));

        // Call service method
        Client result = clientService.getClientById(clientId);

        // Verify result
        assertEquals(clientId, result.getId());
    }


}
