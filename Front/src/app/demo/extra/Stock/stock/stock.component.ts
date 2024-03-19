import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Establishment } from '../../establishments/Service/establishment.model';
import { Router } from '@angular/router';
import { EstablishmentService } from '../../establishments/Service/EstablishmentService';
import { StockProduct } from '../service/models';
import { StockServices } from '../service/stockService';

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


    this.fetchEstablishments();


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

  openAddStock(estabid:number) {

    this.router.navigate(['/admin/stockF', { estabid: estabid }])
  }

  onEdit(estabid:number,id: number): void {
    this.router.navigate(['/admin/stockF', { id: id ,estabid: estabid}]);
 }

 onDelete(id: number,estabid:number): void {
  this.stockService.deleteStockProduct(id)
    .subscribe(
      () => { console.log("stock product deleted"+ id);
        this.load(estabid);
      },
      (error) => {
        console.error('Error deleting stock product', error);
      }
    );
}


load(id :number){

this.fetchStockProducts(id);
  
}

}