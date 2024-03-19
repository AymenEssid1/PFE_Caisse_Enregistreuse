import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Establishment } from '../../establishments/Service/establishment.model';
import { EstablishmentService } from '../../establishments/Service/EstablishmentService';
import { Router } from '@angular/router';
import { SoldServices } from '../service/soldservice';
import { SoldProduct } from '../../Stock/service/models';

@Component({
  selector: 'app-sold-products',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sold-products.component.html',
  styleUrl: './sold-products.component.scss'
})
export class SoldProductsComponent {

  selectedEstablishment: Establishment | null = null;
  soldProducts: SoldProduct[] = [];


  
  constructor(private establishmentService: EstablishmentService, private router: Router ,private soldService :SoldServices) { }
  ngOnInit() {


    this.fetchEstablishments();
    this.fetchSoldProducts(1); 


  }

  establishments: Establishment[] = [];


  fetchSoldProducts(establishmentId: number) {
    this.soldService.getAllSoldProducts(establishmentId).subscribe(
      (data) => {
        this.soldProducts = data;
      },
      (error) => {
        console.error('Error fetching sold products', error);
      }
    );
  }

  deleteSoldProduct(soldProductId: number) {
    this.soldService.deleteSoldProduct(soldProductId).subscribe(
      () => {
        // Reload the sold products after successful deletion
        this.fetchSoldProducts(this.selectedEstablishment.id);
      },
      (error) => {
        console.error('Error deleting sold product', error);
      }
    );
  }


  fetchEstablishments() {
    this.establishmentService.getAllEstablishments().subscribe(
      (data) => {
        this.establishments = data;
        if (this.establishments.length > 0) {

          //this.fetchStockProducts(this.establishments[0].id);
          this.selectedEstablishment = this.establishments[0];

        }
      },



      (error) => {
        console.error('Error fetching establishments', error);
      }
    );
  }

 



  openAddSold(estabid:number) {

    this.router.navigate(['/admin/soldF', { estabid: estabid }])
  }

}
