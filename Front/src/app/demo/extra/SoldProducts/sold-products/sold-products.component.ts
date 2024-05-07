import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Establishment } from '../../establishments/Service/establishment.model';
import { EstablishmentService } from '../../establishments/Service/EstablishmentService';
import { SoldServices } from '../service/soldservice';
import { SoldProduct } from '../../Stock/service/models';
import { NotificationService } from '../../notificationService';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

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

  private routerSubscription: Subscription;


  
  constructor(private router: Router,private notificationService:NotificationService,private establishmentService: EstablishmentService, private soldService :SoldServices) { 
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Fetch sold products data
        // Assuming you have a method to get establishment ID, replace 'establishmentId' with your actual logic
        this.fetchEstablishments();

        this.fetchSoldProducts(1);


      }
    });
  }
  ngOnInit() {
    this.fetchEstablishments();
    this.fetchSoldProducts(1); 
  }

  ngOnDestroy() {
    // Unsubscribe from router events to avoid memory leaks
    this.routerSubscription.unsubscribe();
  }

  

  establishments: Establishment[] = [];


  currentSoldProducts: any[] = []; // Sold products for the current page
  currentPage: number = 1;
  soldProductsPerPage: number = 5;
  totalPages: number;
  totalPagesArray: number[] = [];

  previousPage() {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.setPage(this.currentPage + 1);
    }
  }

  goToPage(page: number) {
    this.setPage(page);
  }

  setPage(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.soldProductsPerPage;
    const endIndex = Math.min(startIndex + this.soldProductsPerPage, this.soldProducts.length);
    this.currentSoldProducts = this.soldProducts.slice(startIndex, endIndex);
  }


  
  

  fetchSoldProducts(establishmentId: number) {
    this.soldService.getAllSoldProducts(establishmentId).subscribe(
      (data) => {
        this.soldProducts = data;
        this.selectedEstablishment = this.establishments.find(establishment => establishment.id === establishmentId);


        this.totalPages = Math.ceil(this.soldProducts.length / this.soldProductsPerPage);
        this.totalPagesArray = []
        // Populate totalPagesArray
        for (let i = 1; i <= this.totalPages; i++) {
          this.totalPagesArray.push(i);
        }
        // Set currentSoldProducts for the initial page
        this.setPage(1);

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
        this.notificationService.showSuccess('','Produit supprimé')
        
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

  onEdit(estabid:number,id: number): void {
    this.router.navigate(['/admin/soldF', { id: id ,estabid: estabid}]);

 }


 
 searchText: string = '';

 searchByName(): void {
   if (!this.searchText.trim()) {
     this.currentSoldProducts = this.soldProducts;
   } else {
     this.currentSoldProducts = this.soldProducts.filter(product =>
       product.name.toLowerCase().includes(this.searchText.toLowerCase())
     );
   }
 }

}
