import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SoldServices } from '../../SoldProducts/service/soldservice';
import { ActivatedRoute, Router } from '@angular/router';
import { Combo, SoldProduct } from '../../Stock/service/models';
import { ComboService } from '../comboService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-combo-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './combo-form.component.html',
  styleUrl: './combo-form.component.scss'
})
export class ComboFormComponent {

  constructor(private formBuilder: FormBuilder,private soldService:SoldServices, private router:Router, private route:ActivatedRoute,private comboService:ComboService){}

  EstabId:number;
  CombotId:number;
  ngOnInit() {

    this.route.params.subscribe(params => {

      this.initializeForm();
      this.EstabId = params['estabid'];
      this.CombotId =params['id']
      if(this.CombotId){
        this.fetchComboDetails(this.CombotId);

      }
      
      this.fetchSoldProducts(this.EstabId);
      
    });



  }

 soldProducts:SoldProduct[]
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

  selectedSoldProductIds: number[] = [];

  fetchComboDetails(id: number): void {
    this.comboService.getComboById(id).subscribe(
      combo => {
        this.comboForm.patchValue({
          name: combo.name,
          ref:combo.ref,
          price:combo.price
  
        });
        console.log(JSON.stringify(combo));
        this.selectedSoldProductIds = combo.soldProducts.map(soldProduct => soldProduct.id);

      },
      error => {
        console.error('Error fetching stock product details:', error);
      }
    );
  }

  comboForm: FormGroup;

  initializeForm(): void {
    this.comboForm = this.formBuilder.group({

      ref: ['', Validators.required],
      name: ['', Validators.required],
      price: ['', Validators.required],
    });
  }

  onSubmit(){
    // two cases add or update

    
    if (this.comboForm.valid) {
      if (this.CombotId) {
       this.edit();
      } else {
        this.add();
      }
    } else {
      console.error('Form is invalid. Cannot submit.');
    }

  }

  edit(): void {
    if (this.comboForm.valid) {
      const updatedCombo: Combo = {
        id: this.CombotId,
        ref: this.comboForm.value.ref,
        name: this.comboForm.value.name,
        price: this.comboForm.value.price,
        soldProducts: this.selectedSoldProductIds.map(id => {
          return new SoldProduct({ id }); // Construct SoldProduct objects with only the ID property
        })
      };
  
      this.comboService.updateCombo(updatedCombo.id,updatedCombo).subscribe(
        () => {
          console.log('Combo updated successfully.');
          // Optionally, navigate to another page or perform other actions upon successful update
        },
        error => {
          console.error('Error updating combo:', error);
        }
      );
    } else {
      console.error('Form is invalid. Cannot submit.');
    }
  }
  


  add(){

    if (this.comboForm.valid) {
      const addedCombo: Combo = {
        id: 1,
        ref: this.comboForm.value.ref,
        name: this.comboForm.value.name,
        price: this.comboForm.value.price,
        soldProducts: this.selectedSoldProductIds.map(id => {
          return new SoldProduct({ id }); // Construct SoldProduct objects with only the ID property
        })      };
  
      this.comboService.createCombo(addedCombo).subscribe(
        () => {
          console.log('Combo created successfully.');
          // Optionally, navigate to another page or perform other actions upon successful update
        },
        error => {
          console.error('Error creating combo:', error);
        }
      );
    } else {
      console.error('Form is invalid. Cannot submit.');
    }
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
  


}
