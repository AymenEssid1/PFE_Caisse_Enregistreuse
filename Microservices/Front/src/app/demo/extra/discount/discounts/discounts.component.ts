import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { EstablishmentService } from '../../establishments/Service/EstablishmentService';
import { Router } from '@angular/router';
import { DiscountService } from '../discountService';
import { Establishment } from '../../establishments/Service/establishment.model';
import { Discount } from '../../Stock/service/models';
import Swal from 'sweetalert2';

export enum DiscountTypes {
  FLAT = "Flat Discount",
  BUY_X_GET_Y = "Buy X Get Y",
  TIME_BOUND = "Time-bound Discount"
}

@Component({
  selector: 'app-discounts',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './discounts.component.html',
  styleUrl: './discounts.component.scss'
})
export class DiscountsComponent {



  constructor(private establishmentService: EstablishmentService, private router: Router, private discountService:DiscountService) { }
  ngOnInit() {


    this.checkRole();
    if (this.accessVar === "admin") { this.fetchEstablishments(); }
    else {
      const ids = localStorage.getItem('establishmentId');
      const id = parseInt(ids, 10); // The second argument specifies the radix (base), 10 for decimal

      this.fetchEstablishmentDetails(id);
      this.fetchDiscounts2(id);
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
      this.accessVar = "peasant"
      let domEl1: HTMLElement | null = document.querySelector('#selectestab');
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

  discounts: Discount[] = [];

  selectedEstablishment: Establishment | null = null;
  
  
  fetchEstablishments() {
    this.establishmentService.getAllEstablishments().subscribe(
      (data) => {
        this.establishments = data;
        if (this.establishments.length > 0) {

          this.fetchDiscounts(this.establishments[0].id);
          this.selectedEstablishment = this.establishments[0];

        }
      },



      (error) => {
        console.error('Error fetching establishments', error);
      }
    );
  }


  fetchDiscounts(id: number) {

    console.log(id);

    this.discountService.getDiscountsByEstablishmentId(id).subscribe((data) => { this.discounts = data; this.selectedEstablishment = this.establishments.find(establishment => establishment.id === id); }
      , (error) => { console.log('error fetching discounts', error); })
  }

  fetchDiscounts2(id: number) {

    console.log(id);

    this.discountService.getDiscountsByEstablishmentId(id).subscribe((data) => { this.discounts = data; }
      , (error) => { console.log('error fetching discounts', error); })
  }


  formatDate(dateString: string): string {
    if (!dateString) {
      console.log("Empty date string");
      return '';
    }
  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.log("Invalid date");
      return '';
    }
  
    const isoString = date.toISOString();
    return isoString.slice(0, 16); // Format it as yyyy-MM-ddTHH:mm
  }








   onEdit(estabid:number,id:number){



    this.router.navigate(['/admin/discountF', { id: id ,estabid: estabid}]);
   }

   
   
   
   onAdd(estabid:number){

    this.router.navigate(['/admin/discountF', { estabid: estabid }])

   }

   /*onDelete(discountId: number): void {
    this.discountService.deleteDiscountById(discountId).subscribe(
      () => {
        console.log('Discount deleted successfully');
        this.fetchDiscounts(this.establishments[0].id);
        // Perform any additional actions if needed
      },
      (error) => {
        console.error('Error deleting discount:', error);
        // Handle error, display error message, etc.
      }
    );
  }*/


  onDelete(discountId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas récupérer cette promo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      cancelButtonText:'Annuler',
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.discountService.deleteDiscountById(discountId).subscribe(
          () => {
            console.log('Discount deleted successfully');
            this.fetchDiscounts(this.establishments[0].id);
          },
          (error) => {
            console.error('Error deleting discount:', error);
          }
        );
      }
    });
  }
   



}
