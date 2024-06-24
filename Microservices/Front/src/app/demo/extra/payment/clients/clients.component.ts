import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { ClientService } from './clientService';
import { Client } from '../../Stock/service/models';
import { SessionSelectionService } from '../../session/SessionSelectionService';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  @Input() title: string;
  @Input() isOpen: boolean;
  @Output() closeModal = new EventEmitter<void>();

  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;


  constructor(private clientService:ClientService,private sessionSelectionService: SessionSelectionService){}


  clients: Client[] = [];
  private clientSubscription: Subscription;

  ngOnInit(): void {
    const establishmentId = localStorage.getItem("establishmentId");
    if (establishmentId) {
      this.getAllClientsByEstablishmentId(parseInt(establishmentId, 10));
    } else {
      console.error('Establishment ID not found in local storage');
    }
    this.clientSubscription = this.sessionSelectionService.client$.subscribe(client => {
      this.client = client;
      console.log('Client:', this.client);
    });
    
  }


  getAllClientsByEstablishmentId(establishmentId: number): void {
    this.clientService.getAllClients(establishmentId).subscribe(
      clients => {
        this.clients = clients;
        console.log('Clients:', this.clients);
      },
      error => console.error('Error fetching clients:', error)
    );
  }

  close() {
    this.closeModal.emit();
  }

  addUser(): void {
  Swal.fire({
    title: 'Informations du client',
    html:
      `<input id="swal-input1" class="swal2-input" placeholder="Prénom" required>` +
      `<input id="swal-input2" class="swal2-input" placeholder="Nom de famille" required>` +
      `<input id="swal-input3" class="swal2-input" placeholder="Email" required>` +
      `<input id="swal-input4" class="swal2-input" placeholder="Numéro de téléphone" required>`,
    showCancelButton: true,
    confirmButtonText: 'Confirmer',
    cancelButtonText: 'Annuler',
    confirmButtonColor:'#1de9b6',
    preConfirm: () => {
      const firstname = (document.getElementById('swal-input1') as HTMLInputElement).value;
      const lastname = (document.getElementById('swal-input2') as HTMLInputElement).value;
      const email = (document.getElementById('swal-input3') as HTMLInputElement).value;
      const phone = (document.getElementById('swal-input4') as HTMLInputElement).value;
      const establishmentId =localStorage.getItem("establishmentId");

      if (!firstname || !lastname || !email || !phone) {
        Swal.showValidationMessage('Veuillez remplir tous les champs');
       
      }

      // Check if email format is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Swal.showValidationMessage('Veuillez saisir une adresse email valide');
      }

      const phoneRegex = /^\d{8}$/;
      if (!phoneRegex.test(phone)) {
        Swal.showValidationMessage('Veuillez saisir un numéro de téléphone valide (8 chiffres)');
        return false;
      }

      return { firstname, lastname, email, phone , establishmentId };
    }
  }).then((result) => {
    console.log(result.value);
    if (result.isConfirmed && result.value) {
      this.clientService.saveClient(result.value).subscribe(
        (client) => {
          Swal.fire('Succès', 'Client ajouté avec succès', 'success');
          console.log(client);
          this.sessionSelectionService.setClient(client);
          this.close();
        },
        error => {
          if (error.status === 409) {
            Swal.fire('Erreur', 'L\'adresse email est déjà utilisée par un autre client', 'error');
          } else {
            Swal.fire('Erreur', 'Une erreur est survenue lors de l\'ajout du client', 'error');
          }
        }
      );
    }
  });
}


searchQuery: string = '';


searchClientByEmailOrPhoneNumber(query: string): void {
  const establishmentId =Number(localStorage.getItem("establishmentId"));

  this.clientService.findClientByEmailOrPhoneNumberAndEstablishmentId(query, establishmentId)
    .subscribe(
      (client) => {
        console.log('Client found:', client);
        this.showClientInfo(client);
        
      },
      (error) => {
        if (error.status === 404) {
          console.log('Client not found');
          this.showClientNotFoundAlert();
        } else {
          console.error('Error searching for client:', error);
        }
      }
    );
}


client:Client;
showClientInfo(client: Client): void {
  Swal.fire({
    title: 'Informations du client',
    html: `
      <div>
        <strong>Prénom :</strong> ${client.firstname}<br>
        <strong>Nom de famille :</strong> ${client.lastname}<br>
        <strong>Email :</strong> ${client.email}<br>
        <strong>Numéro de téléphone :</strong> ${client.phone}<br>
        <strong>Points de fidélité :</strong> ${client.fidelityPoints}<br>
      </div>
    `,
    icon: 'info',
    confirmButtonText: 'OK',
    confirmButtonColor:'#1de9b6'
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('Client information displayed:', client);

      this.sessionSelectionService.setClient(client);
      this.close();

    }
  });
}


showClientNotFoundAlert(): void {
  Swal.fire({
    title: 'Client introuvable',
    text: 'Ce client n\'a pas été trouvé. Voulez-vous en ajouter un nouveau?',
    icon: 'warning',
    confirmButtonText: 'Oui',
    cancelButtonText: 'Non',
    confirmButtonColor:'#1de9b6',
  }).then((result) => {
    if (result.isConfirmed) {
      this.addUser();


    }
  });
}


}
