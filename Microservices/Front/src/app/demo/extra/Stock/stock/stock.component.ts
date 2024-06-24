import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Establishment } from '../../establishments/Service/establishment.model';
import { Router } from '@angular/router';
import { EstablishmentService } from '../../establishments/Service/EstablishmentService';
import { StockProduct } from '../service/models';
import { StockServices } from '../service/stockService';
import Swal from 'sweetalert2';
import { NotificationService } from '../../notificationService';


@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})
export class StockComponent {

  constructor(private establishmentService: EstablishmentService, private router: Router, private stockService: StockServices) { }
  ngOnInit() {


    

    this.checkRole();
    if (this.accessVar === "admin") { this.fetchEstablishments(); }
    else {
      const ids = localStorage.getItem('establishmentId');
      const id = parseInt(ids, 10); // The second argument specifies the radix (base), 10 for decimal

      this.fetchEstablishmentDetails(id);
      this.fetchStockProducts2(id);
    }


  }


  fetchEstablishmentDetails(id: number): void {
    this.establishmentService.getEstablishmentById(id).subscribe(
      establishment => {
        this.establishments.push(establishment);
        console.log(this.establishments);
        this.selectedEstablishment = establishment;
        console.log(JSON.stringify(establishment));
      },
      error => {
        console.error('Error fetching establishment details:', error);
      }
    );
  }



  accessVar:string;
  checkRole(): void {

    const roles = JSON.parse(localStorage.getItem('roles'));
    // Check if roles include ADMIN
    const isAdmin = roles.includes('ADMIN');
    // If not admin, filter out the SuperAdmin item
    if (isAdmin) {
      this.accessVar = "admin"
      console.log("admin here");
    } else {
      this.accessVar = "peasant"
      let domEl1: HTMLElement | null = document.querySelector('#selectestab');
      domEl1 && (domEl1.style.visibility = 'hidden');

    }


  }

  establishments: Establishment[] = [];

  stockProducts: StockProduct[] = [];

  selectedEstablishment: Establishment | null = null;
  fetchEstablishments() {
    this.establishmentService.getAllEstablishments().subscribe(
      (data) => {
        this.establishments = data;
        if (this.establishments.length > 0) {

          this.fetchStockProducts(this.establishments[0].id);
          this.selectedEstablishment = this.establishments[0];

        }
      },



      (error) => {
        console.error('Error fetching establishments', error);
      }
    );
  }


  fetchStockProducts(id: number) {

    console.log(id);

    this.stockService.getAllStockProducts(id).subscribe((data) => { this.stockProducts = data; this.selectedEstablishment = this.establishments.find(establishment => establishment.id === id); }
      , (error) => { console.log('error fetching stock products', error); })
  }

  fetchStockProducts2(id: number) {

    console.log(id);

    this.stockService.getAllStockProducts(id).subscribe((data) => { this.stockProducts = data; }
      , (error) => { console.log('error fetching stock products', error); })
  }

  openAddStock(estabid:number) {

    this.router.navigate(['/admin/stockF', { estabid: estabid }])
  }

  onEdit(estabid:number,id: number): void {
    this.router.navigate(['/admin/stockF', { id: id ,estabid: estabid}]);
 }

 onDelete(id: number, estabid: number): void {
  Swal.fire({
    title: 'Êtes-vous sûr?',
    text: 'Vous ne pourrez pas récupérer ce point de vente!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    cancelButtonText:'Annuler',
    confirmButtonText: 'Oui, supprimer!'
  }).then((result) => {
    if (result.isConfirmed) {
      // If user confirms the deletion
      this.stockService.deleteStockProduct(id)
        .subscribe(
          () => {
            console.log("Stock product deleted: " + id);
            this.load(estabid);
          },
          (error) => {
            console.error('Error deleting stock product', error);
          }
        );
    }
  });
}


load(id :number){

this.fetchStockProducts(id);
  
}

}