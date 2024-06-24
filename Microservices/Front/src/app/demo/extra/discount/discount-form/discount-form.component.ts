import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SoldServices } from '../../SoldProducts/service/soldservice';
import { ComboService } from '../../combo/comboService';
import { DiscountService } from '../discountService';
import { ActivatedRoute, Router } from '@angular/router';
import { Combo, Discount, DiscountType, SoldProduct } from '../../Stock/service/models';
import { NotificationService } from '../../notificationService';

@Component({
  selector: 'app-discount-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './discount-form.component.html',
  styleUrl: './discount-form.component.scss'
})
export class DiscountFormComponent {


  constructor(private notificationService: NotificationService,private formBuilder: FormBuilder,private soldService:SoldServices,private discountService:DiscountService, private router:Router, private route:ActivatedRoute,private comboService:ComboService){}

  EstabId:number;
  DiscountId:number;
  ngOnInit() {

    this.route.params.subscribe(params => {

      this.initializeForm();
      this.EstabId = params['estabid'];
      this.DiscountId =params['id']
      if(this.DiscountId){
        this.fetchDiscountDetails(this.DiscountId);

      }
      
      this.fetchSoldProductsAndCombos(this.EstabId);
      

      
    });



  }

 soldProducts:SoldProduct[]
 combos:Combo[]

 originalSoldProducts: SoldProduct[] = [];
  originalCombos: Combo[] = [];
  fetchSoldProductsAndCombos(establishmentId: number) {
    this.soldService.getAllSoldProducts(establishmentId).subscribe(
      (data) => {
        this.soldProducts = data;
        this.originalSoldProducts = [...data];

      },
      (error) => {
        console.error('Error fetching sold products', error);
      }
    );

    this.comboService.getAllCombosByEstablishmentId(establishmentId).subscribe(
      (data) => {
        this.combos = data;
        this.originalCombos = [...data];
      },
      (error) => {
        console.error('Error fetching combos', error);
      }
    );
  }







  selectedSoldProductIds: number[] = [];

  selectedCombosIds: number[] = [];

  fetchDiscountDetails(id: number): void {
    this.discountService.getDiscountById(id).subscribe(
      discount => {
        this.discountForm.patchValue({
          name: discount.name,
          percentage:discount.percentage,
          discountType:discount.discountType,
          buyX:discount.buyX,
          getY:discount.getY,
          startTime:this.formatDate(discount.startTime),
          endTime:this.formatDate(discount.endTime),
  
        });
        console.log(JSON.stringify(discount));
        this.selectedSoldProductIds = discount.soldProducts.map(soldProduct => soldProduct.id);
        this.selectedCombosIds = discount.combos.map(combo => combo.id);


      },
      error => {
        console.error('Error fetching discount details:', error);
      }
    );
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
  
  
  
  
  toggleSoldProductSelection(soldProductId: number): void {
    if (this.isSelectedSoldProduct(soldProductId)) {
      this.selectedSoldProductIds = this.selectedSoldProductIds.filter(id => id !== soldProductId);
    } else {
      this.selectedSoldProductIds.push(soldProductId);
    }

    console.log('Selected Sold Product IDs:', this.selectedSoldProductIds);

  }
  
  isSelectedSoldProduct(soldProductId: number): boolean {
    return this.selectedSoldProductIds.includes(soldProductId);
  }


  toggleComboSelection(comboId: number): void {
    if (this.isSelectedCombo(comboId)) {
      this.selectedCombosIds = this.selectedCombosIds.filter(id => id !== comboId);
    } else {
      this.selectedCombosIds.push(comboId);
    }

    console.log('Selected Combo IDs:', this.selectedCombosIds);

  }
  
  isSelectedCombo(comboId: number): boolean {
    return this.selectedCombosIds.includes(comboId);
  }

  
  discountForm: FormGroup;
  discountTypes = Object.values(DiscountType);


  initializeForm(): void {
    this.discountForm = this.formBuilder.group({
      name: ['', Validators.required],
      percentage: ['', Validators.required],
      discountType: ['', Validators.required],
      buyX: [''],
      getY: [''],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  
    this.discountForm.get('discountType').valueChanges.subscribe(value => {
      const percentageControl = this.discountForm.get('percentage');
      const buyXControl = this.discountForm.get('buyX');
      const getYControl = this.discountForm.get('getY');
  
      if (value === 'FLAT') {
        percentageControl.enable();
        percentageControl.setValidators(Validators.required);
  
        buyXControl.disable();
        buyXControl.setValue('');
        getYControl.disable();
        getYControl.setValue('');
      } else if (value === 'BUY_X_GET_Y') {
        percentageControl.disable();
        percentageControl.setValue('');
        buyXControl.enable();
        buyXControl.setValidators(Validators.required);
        getYControl.enable();
        getYControl.setValidators(Validators.required);
      } else {
        // Other cases
        percentageControl.enable();
        percentageControl.setValidators(Validators.required);
  
        buyXControl.enable();
        buyXControl.setValidators(null);
        getYControl.enable();
        getYControl.setValidators(null);
      }
  
      percentageControl.updateValueAndValidity();
      buyXControl.updateValueAndValidity();
      getYControl.updateValueAndValidity();
    });
  }
  
  onSubmit(){
    
    
    if (this.discountForm.valid) {
      if (this.DiscountId) {
       this.edit();
      } else {
        this.add();
      }
    } else {
      console.error('Form is invalid. Cannot submit.');
      this.notificationService.showError("Erreur","Verifier tous les champs du formulaire")
    }

  }

  edit(): void {
    if (this.discountForm.valid) {
      const updatedDiscount: Discount = {
        id: this.DiscountId,
        name: this.discountForm.value.name,
        percentage: this.discountForm.value.percentage,
        buyX: this.discountForm.value.buyX,
        getY: this.discountForm.value.getY,
        startTime:this.discountForm.value.startTime,
        endTime:this.discountForm.value.endTime,
        discountType:this.discountForm.value.discountType,
        soldProducts: this.selectedSoldProductIds.map(id => {
          return new SoldProduct({ id }); 
        }),
        combos: this.selectedCombosIds.map(id => {
          return new Combo({ id }); 
        })
      };

      console.log(JSON.stringify(updatedDiscount));
  
     this.discountService.updateDiscount(updatedDiscount.id,updatedDiscount).subscribe(
        () => {
          console.log('DISCOUNT updated successfully.');
          this.router.navigate(['/admin/discount'] )       },
        error => {
          console.error('Error updating DISCOUNT:', error);
        }
      );
    } else {
      console.error('Form is invalid. Cannot submit.');
    }
  }


  add(): void {
    if (this.discountForm.valid) {
      const addedDiscount: Discount = {
        id: this.DiscountId,
        name: this.discountForm.value.name,
        percentage: this.discountForm.value.percentage,
        buyX: this.discountForm.value.buyX,
        getY: this.discountForm.value.getY,
        startTime:this.discountForm.value.startTime,
        endTime:this.discountForm.value.endTime,
        discountType:this.discountForm.value.discountType,
        soldProducts: this.selectedSoldProductIds.map(id => {
          return new SoldProduct({ id }); 
        }),
        combos: this.selectedCombosIds.map(id => {
          return new Combo({ id }); 
        })
      };

  
     this.discountService.createDiscount(addedDiscount).subscribe(
        () => {
          console.log('DISCOUNT added successfully.');
          this.router.navigate(['/admin/discount'] )        },
        error => {
          console.error('Error updating DISCOUNT:', error);
        }
      );
    } else {
      console.error('Form is invalid. Cannot submit.');
    }
  }



  soldProductSearch: string = '';
  comboSearch: string = '';

   // Filter sold products based on search input
   filterSoldProducts(): void {
    if (this.soldProductSearch.trim() === '') {
      this.soldProducts = [...this.originalSoldProducts];
    } else {
      this.soldProducts = this.originalSoldProducts.filter(product =>
        product.name.toLowerCase().includes(this.soldProductSearch.toLowerCase())
      );
    }
  }

  // Filter combos based on search input
  filterCombos(): void {
    if (this.comboSearch.trim() === '') {
      this.combos = [...this.originalCombos];
    } else {
      this.combos = this.originalCombos.filter(combo =>
        combo.name.toLowerCase().includes(this.comboSearch.toLowerCase())
      );
    }
  }
}


