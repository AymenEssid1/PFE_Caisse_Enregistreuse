import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { EstablishmentService } from '../../establishments/Service/EstablishmentService';
import { Router } from '@angular/router';
import { DiscountService } from '../discountService';
import { Establishment } from '../../establishments/Service/establishment.model';
import { Discount } from '../../Stock/service/models';

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


    this.fetchEstablishments();


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

   onDelete(discountId: number): void {
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
  }
   



}
