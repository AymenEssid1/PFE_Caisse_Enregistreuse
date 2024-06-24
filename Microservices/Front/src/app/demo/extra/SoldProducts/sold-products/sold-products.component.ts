import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Establishment } from '../../establishments/Service/establishment.model';
import { EstablishmentService } from '../../establishments/Service/EstablishmentService';
import { SoldServices } from '../service/soldservice';
import { SoldProduct } from '../../Stock/service/models';
import { NotificationService } from '../../notificationService';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';


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



  
  constructor(private router: Router,private notificationService:NotificationService,private establishmentService: EstablishmentService, private soldService :SoldServices) { 
    
  }
  ngOnInit() {
   // this.fetchEstablishments();
    //this.fetchSoldProducts(1); 

    this.checkRole();
    if (this.accessVar === "admin") { this.fetchEstablishments(); 
      this.fetchSoldProducts(1);
      console.log("ADMIIIIIN");
    }
    else {
      const ids = localStorage.getItem('establishmentId');
      const id = parseInt(ids, 10); // The second argument specifies the radix (base), 10 for decimal

      console.log("NOT AN ADMIN");
      this.fetchEstablishmentDetails(id);
      this.fetchSoldProducts2(id);
    }
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
      console.log("DISAPPEAR");
      this.accessVar = "peasant"
      let domEl1: HTMLElement | null = document.querySelector('#selectestab2');
      domEl1 && (domEl1.style.visibility = 'hidden');

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


  fetchSoldProducts2(establishmentId: number) {
    this.soldService.getAllSoldProducts(establishmentId).subscribe(
      (data) => {
        this.soldProducts = data;
       


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

  onDelete(soldProductId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas récupérer ce produit',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      cancelButtonText:'Annuler',
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        // If user confirms the deletion
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
    });
  }

 

  /*deleteSoldProduct(soldProductId: number) {
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
  }*/


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
