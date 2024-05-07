import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockServices } from '../service/stockService';
import { ActivatedRoute, Router } from '@angular/router';
import { StockProduct } from '../service/models';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotificationService } from '../../notificationService';

@Component({
  selector: 'app-stock-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './stock-form.component.html',
  styleUrl: './stock-form.component.scss'
})
export class StockFormComponent {



  constructor(private formBuilder: FormBuilder, private stockService :StockServices,    private route: ActivatedRoute,

    private router:Router,private notificationService: NotificationService) {}


    stockProductForm: FormGroup ;
    stockProductId: number;
    stockProductEstabId:number;


    ngOnInit(): void {
      this.route.params.subscribe(params => {
        this.stockProductEstabId = params['estabid'];
        this.stockProductId =params['id']
        this.initializeForm();
        if (this.stockProductEstabId) {
          console.log(this.stockProductEstabId);
        }
        if (this.stockProductId) {
          this.fetchStockProductDetails(this.stockProductId);
        }
      });
    }
    units: string[] = ['KG', 'Litres', 'Pièces']; // Define and populate the list of units

    initializeForm(): void {
      this.stockProductForm = this.formBuilder.group({

        refstock: ['', Validators.required],
        name: ['', Validators.required],
        quantity: ['', [Validators.required, Validators.min(0)]],
        unit: ['', Validators.required] // Add a form control for unit selection

      });
    }

    getRefstockErrorMessage(): string {
      if (this.stockProductForm.get('refstock').hasError('required')) {
        return 'La référence du produit est requise';
      } return '';
    }
    
    getNameErrorMessage(): string {
      if (this.stockProductForm.get('name').hasError('required')) {
        return 'Le nom du produit est requis';
      } return '';
    }
    
    getUnitErrorMessage(): string {
      if (this.stockProductForm.get('unit').hasError('required')) {
        return 'L\'unité du produit est requise';
      } return '';
    }
    
    getQuantityErrorMessage(): string {
      const quantityControl = this.stockProductForm.get('quantity');
      if (quantityControl.hasError('required')) {
        return 'La quantité est requise';
      } else if (quantityControl.hasError('min')) {
        return 'La quantité doit être supérieure ou égale à 0';
      } return '';
    }
  
    onSubmit(): void {
      if (this.stockProductForm.valid) {
        if (this.stockProductId) {
         this.editStockProduct();
        } else {
          this.addStockProduct();
        }
      } else {
        this.notificationService.showError("","Formulaire invalide vérifier tous les champs")

        console.error('Form is invalid. Cannot submit.');
      }
    }


    addStockProduct(){


      const formData = this.stockProductForm.value;
      const newStockProduct = new StockProduct({
        refstock: formData.refstock,
        name: formData.name,
        quantity: formData.quantity,
        unit:formData.unit,
        establishment: { id: this.stockProductEstabId } // Assuming Establishment model has an id property
      });

      this.stockService.addStockProduct(this.stockProductEstabId, newStockProduct)
      .subscribe(
        (response) => {
          console.log('Stock product added successfully:', response);
          // Reset form after successful submission
          this.stockProductForm.reset();
        },
        (error) => {
          console.error('Error adding stock product:', error);
          // Handle error if needed
        }
      );

      this.router.navigate(['/admin/stock'], { queryParams: { estabid: this.stockProductEstabId } });

  

}

editStockProduct(): void {
  const formData = this.stockProductForm.value;
  const updatedStockProduct = new StockProduct({
    id: this.stockProductId,
    refstock: formData.refstock,
    name: formData.name,
    quantity: formData.quantity,
    unit:formData.unit,
    establishment: { id: this.stockProductEstabId }
  });

  this.stockService.updateStockProduct(this.stockProductEstabId, this.stockProductId, updatedStockProduct).subscribe(
    (response) => {
      console.log('Stock product updated successfully:', response);
      this.stockProductForm.reset();
    },
    (error) => {
      console.error('Error updating stock product:', error);
      // Handle error if needed
    }
  );

  this.router.navigate(['/admin/stock'], { queryParams: { estabid: this.stockProductEstabId } });

}


fetchStockProductDetails(id: number): void {
  this.stockService.getStockPById(id).subscribe(
    stockproduct => {
      this.stockProductForm.patchValue({
        name: stockproduct.name,
        refstock:stockproduct.refstock,
        quantity:stockproduct.quantity

      });
    },
    error => {
      console.error('Error fetching stock product details:', error);
    }
  );
}


stockProducts: StockProduct[] = [];


    

}
