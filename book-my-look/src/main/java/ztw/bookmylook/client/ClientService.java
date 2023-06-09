package ztw.bookmylook.client;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import ztw.bookmylook.client.dto.ClientDto;

@Service
public class ClientService {
    private final ClientRepository clientRepository;
    private final ModelMapper modelMapper;


    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
        this.modelMapper = new ModelMapper();
    }

    public Client getClientById(long id) {
        return clientRepository.findById(id).orElse(null);
    }

    public Client addClient(ClientDto client) {
        Client newClient = modelMapper.map(client, Client.class);
        return clientRepository.save(newClient);
    }

    public Client updateClient(long id, ClientDto clientDto) {
        var client = getClientById(id);
        modelMapper.map(clientDto, client);
        return clientRepository.save(client);
    }

    public ClientDto mapClientToDto(Client client) {
        return modelMapper.map(client, ClientDto.class);
    }

    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
    }
}
