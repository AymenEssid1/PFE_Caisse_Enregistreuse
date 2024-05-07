import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Establishment } from './Service/establishment.model';
import { EstablishmentService } from './Service/EstablishmentService';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


import Swal from 'sweetalert2';
import { StockServices } from '../Stock/service/stockService';
import { StockProduct } from '../Stock/service/models';

@Component({
  selector: 'app-establishments',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './establishments.component.html',
  styleUrl: './establishments.component.scss'
})
export class EstablishmentsComponent {

  establishments: Establishment[] = [];


  constructor(private stockService: StockServices,private establishmentService: EstablishmentService,private router:Router) {}

  ngOnInit(): void {
    this.fetchEstablishments();
  }

  openAddEstablishment(): void {
    console.log("hello");
    this.router.navigate(['/admin/addestablishments'])
  }

  onEdit(id: number): void {
    this.router.navigate(['/admin/addestablishments', { id: id }]);
}

  fetchEstablishments() {
    this.establishmentService.getAllEstablishments().subscribe(
      (data) => {
        this.establishments = data;
      },
      (error) => {
        console.error('Error fetching establishments', error);
      }
    );
  }


  stockProducts: StockProduct[] = [];

  fetchStockProducts(id: number) {

    console.log(id);

    this.stockService.getAllStockProducts(id).subscribe((data) => { this.stockProducts = data; }
      , (error) => { console.log('error fetching stock products', error); })
  }

  

  onDelete(id: number): void {
    // Fetch stock data for the establishment
    this.stockService.getAllStockProducts(id).subscribe(
      (data) => {
        // Check if stock data exists
        if (data && data.length > 0) {
          // Stock data exists, show confirmation to transfer stock first
          Swal.fire({
            title: 'Attention!',
            text: 'Vous devez d\'abord transférer le stock avant de supprimer ce point de vente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Transférer',
            cancelButtonText: 'Annuler'
          }).then((result) => {
            if (result.isConfirmed) {
              // User confirmed to transfer stock, trigger transfer
              this.confirmBox(id);
            }
          });
        } else {
          // No stock data, proceed with deletion
          this.confirmDelete(id);
        }
      },
      (error) => {
        // Error fetching stock data, proceed with deletion
        console.error('Error fetching stock products:', error);
        this.confirmDelete(id);
      }
    );
  }
  
  confirmDelete(id: number): void {
    // Show confirmation dialog for deletion
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas récupérer ce point de vente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed deletion, proceed with deletion
        this.establishmentService.deleteEstablishment(id).subscribe(
          () => {
            console.log("establishment deleted");
            this.load();
          },
          (error) => {
            console.error('Error deleting establishment:', error);
            Swal.fire('Erreur!', 'Erreur lors de la suppression de l\'établissement.', 'error');
          }
        );
      }
    });
  }
  

  load():void{

    this.fetchEstablishments();
   
  }



  simpleAlert(){
    Swal.fire('Hello world!');
  }
  
  alertWithSuccess(){
    Swal.fire('Thank you...', 'You submitted succesfully!', 'success')
  }


  confirmBox(establishmentId: number): void {
    const selectOptions = this.establishments.map(establishment => `<option value="${establishment.id}">${establishment.name}</option>`).join('');
    
    Swal.fire({
      title: 'Transfert de stock',
      html: `
        <select id="targetEstablishment" class="swal2-select">
          <option value="">Sélectionner un point de vente</option>
          ${selectOptions}
        </select>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Transférer',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const targetEstablishmentId = (<HTMLSelectElement>document.getElementById('targetEstablishment')).value;
        if (!targetEstablishmentId) {
          Swal.showValidationMessage('Sélectionner un point de vente');
        } else {
          this.transferData(establishmentId, parseInt(targetEstablishmentId, 10));
        }
      }
    });
  }
  
  
  
  transferData(originalestabId: number, targetEstablishmentId: number): void {
    this.establishmentService.transferData(originalestabId, targetEstablishmentId).subscribe(
      () => {
        Swal.fire('Succès', 'Succès de transfert', 'success');
        this.load();
      },
      (error) => {
        Swal.fire('Error', `Failed to transfer data: ${error}`, 'error');
      }
    );
  }



  getDeleteTooltipText(): string {
    return 'Supprimer';
  }

  getDownloadTooltipText(): string {
    return 'Transfer de Stock';
  }

  getEditTooltipText(): string {
    return 'Modifier';
  }
  
}
