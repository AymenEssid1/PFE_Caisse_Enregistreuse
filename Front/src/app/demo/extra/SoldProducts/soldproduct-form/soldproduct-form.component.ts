import { Component, OnInit } from '@angular/core';
import { SoldServices } from '../service/soldservice';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Category, SoldProduct, StockEquivalent, StockProduct } from '../../Stock/service/models';
import { StockServices } from '../../Stock/service/stockService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { NotificationService } from '../../notificationService';

@Component({
  selector: 'app-soldproduct-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './soldproduct-form.component.html',
  styleUrl: './soldproduct-form.component.scss'
})
export class SoldproductFormComponent implements OnInit {

  categories: Category[] = [];
  newCategoryName: string = '';
  newCategoryName2: string = '';
  establishmentId: number;
  soldProductId: number;

  constructor(
    private notificationService:NotificationService,
    private stockService: StockServices,
    private soldService: SoldServices,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
     private cdr: ChangeDetectorRef
  ) { }



  ngOnInit(): void {

    
    this.route.params.subscribe(params => {
      this.initializeForm();
      this.establishmentId = params['estabid'];
      this.soldProductId = params['id']
      this.fetchStockProducts(this.establishmentId);
    this.fetchCategories(this.establishmentId);
      if (this.soldProductId) {
        this.fetchSoldDetails(this.soldProductId);

      } else { console.log("where u at bro"); }

     

    });


  }

  soldForm: FormGroup;

  initializeForm(): void {
    this.soldForm = this.formBuilder.group({

      ref: ['', Validators.required],
      name: ['', Validators.required],
      price: ['', Validators.required],
    });
  }

  validateImage(event: any): void {
    const file = event.target.files[0];
    const fileType = file.type;
    if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
       
        event.target.value = '';
        
        const feedback = document.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.classList.add('d-block'); // Display the feedback
        }
    } else {
     
        const feedback = document.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.classList.remove('d-block'); // Hide the feedback
        }
    }
}

  oldquant:number[]=[];
  Quantities: number[] = [];

  fetchSoldDetails(id: number): void {
    this.soldService.getById(id).subscribe(
      (soldProduct) => {

        this.soldForm.patchValue({
          name: soldProduct.name,
          ref:soldProduct.ref,
          price:soldProduct.price
  
        });
        console.log('Sold product details:', JSON.stringify(soldProduct));
      this.selectedStockProductIds = soldProduct.stockEquivalents.map(stockEquivalent => stockEquivalent.stockproduct.id);
      this.Quantities = soldProduct.stockEquivalents.map(stockEquivalent => stockEquivalent.quantity);

      console.log(this.selectedStockProductIds
        );
      this.selectedStockProductPositions = this.selectedStockProductIds.map(id =>
      this.stockProducts.findIndex(product => product.id === id));
      console.log(this.selectedStockProductPositions);
      this.selectedStockProducts = this.stockProducts.filter(product => this.selectedStockProductIds.includes(product.id));

      console.log(this.selectedStockProducts);

      for (let i = 0; i < this.selectedStockProductPositions.length; i++) {
        const position = this.selectedStockProductPositions[i];
        const quantity = this.Quantities[i];
        this.selectedQuantities[position] = quantity; 
        console.log(this.selectedQuantities);
      }


       this.onCategorySelect(soldProduct.category);
             this.cdr.detectChanges();


      },
      (error) => {
        console.error('Error fetching sold product details:', error);
      }
    );
  }


  

  
  

  areCategoriesEqual(category1: Category | null, category2: Category | null): boolean {
    if (category1 === null && category2 === null) {
      return true; // Both categories are null, consider them equal
    } else if (category1 === null || category2 === null) {
      return false; // One category is null while the other is not, consider them not equal
    } else {
      // Compare the properties of the two non-null category objects
      return category1.categoryName === category2.categoryName /* Add other properties to compare */;
    }
  }
  
  
  

  fetchCategories(establishmentId: number): void {
    this.soldService.getAllCategories(establishmentId).subscribe(
      categories => {
        this.categories = categories;
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  addCategory(establishmentId: number): void {
    const newCategory: Category = { id: null, categoryName: this.newCategoryName2, establishment: null };
    this.soldService.addCategory(establishmentId, newCategory).subscribe(
      addedCategory => {
        this.categories.push(addedCategory);
        this.newCategoryName2 = ''; // Clear the input field after adding
      },
      error => {
        console.error('Error adding category:', error);
      }
    );
  }


  selectedCategory: Category | null = null;

  editCategory(category: Category): void {
    this.selectedCategory = category;
    this.newCategoryName = category.categoryName;
  }

  updateCategory(): void {
    if (this.selectedCategory) {
      const updatedCategory = { ...this.selectedCategory, categoryName: this.newCategoryName };
      this.soldService.updateCategory(this.selectedCategory.id, updatedCategory).subscribe(
        updated => {
          console.log('Category updated successfully:', updated);
          // Refresh the categories list after updating
          this.fetchCategories(updated.establishment.id);
          // Reset selectedCategory and newCategoryName
          this.selectedCategory = null;
          this.newCategoryName = '';
        },
        error => {
          console.error('Error updating category:', error);
        }
      );
    }
  }

  deleteCategory(categoryId: number): void {
    this.soldService.deleteCategory(categoryId).subscribe(
      () => {
        this.categories = this.categories.filter(c => c.id !== categoryId);
        console.log('Category deleted successfully.');
      },
      error => {
        console.error('Error deleting category:', error);
      }
    );
  }

  onNewCategoryNameChange(event: any): void {
    this.newCategoryName = event.target.value;
  }


  stockProducts: StockProduct[] = [];

  fetchStockProducts(id: number) {

    console.log(id);

    this.stockService.getAllStockProducts(id).subscribe((data) => { this.stockProducts = data; }
      , (error) => { console.log('error fetching stock products', error); })
  }

  selectedCategory3: Category | null = null;

  onCategorySelect(category: Category): void {
    console.log(category);
    if (this.selectedCategory3 === category) {
      this.selectedCategory3 = null; // Deselect the category if it's already selected
    } else {
      this.selectedCategory3 = category;
    }
    console.log("Selected category:", this.selectedCategory3);
  }

  
   
  selectedStockProductPositions: number[] = [];
  selectedStockProductIds: number[] = [];
  selectedStockProducts: StockProduct[] = []; // New array to store selected sold products

  

  toggleStockProductSelection(stockProductId: number): void {
    if (this.isSelectedStockProduct(stockProductId)) {
      this.selectedStockProductIds = this.selectedStockProductIds.filter(id => id !== stockProductId);
      this.selectedStockProducts = this.stockProducts.filter(product => this.selectedStockProductIds.includes(product.id));

    } else {
      this.selectedStockProductIds.push(stockProductId);
      this.selectedStockProducts = this.stockProducts.filter(product => this.selectedStockProductIds.includes(product.id));

    }
    this.selectedStockProductPositions = this.selectedStockProductIds.map(id =>
      this.stockProducts.findIndex(product => product.id === id)) .sort((a, b) => a - b);
      console.log(stockProductId);

   console.log('Selected Sold Product IDs:', this.selectedStockProductIds);
   console.log('selected stock products   ', this.selectedStockProducts);
   console.log('Selected Sold Product Positions:', this.selectedStockProductPositions);




  }

  

  isSelectedStockProduct(stockProductId: number): boolean {
    return this.selectedStockProductIds.includes(stockProductId);
  }



  selectedQuantities: number[] = [];
  stockEquivalents: StockEquivalent[] = []



  submitted: boolean = false;
  newSoldProduct: SoldProduct = {
    id: 1,
    ref: '',
    name: '',
    price: 0,
    category: null,
    stockEquivalents: []
  };


  newStockEquivalents: StockEquivalent[] = [];


  onSubmit(): void {



    if (!this.selectedCategory3) {
      this.notificationService.showWarning('','Une catégorie doit être sélectionné.');
      return;
    }

    if (this.selectedStockProductIds.length === 0) {
      this.notificationService.showWarning('','Au moins un produit de stock doit être sélectionné');
      return;
    }
    else { console.log(this.selectedStockProducts); }


    // Loop through selected stock products and their quantities
    for (let i = 0; i < this.selectedStockProductPositions.length; i++) {
      const position = this.selectedStockProductPositions[i];

      const stockProduct = this.selectedStockProducts[i];
      const quantity = this.selectedQuantities[position];
      console.log("selected quant" + quantity + " id:" + i);
      // Check if quantity is missing
      if (!quantity || isNaN(quantity)) {
        this.newStockEquivalents=[];
        this.notificationService.showWarning('','Le champs de quantité doit être rempli.');
        
        return;
      }

      // Create new stock equivalent
      const stockEquivalent: StockEquivalent = {
        quantity: quantity,
        stockproduct: stockProduct
      };


      // Add it to the list of stock equivalents
      this.newStockEquivalents.push(stockEquivalent);
      console.log("list of created SE:", JSON.stringify(this.newStockEquivalents));
    }


   
    if(this.soldProductId){this.edit();}else{this.add();}

  }
  imageFile: File; 


 
  imageUrl: string = ''; // Initialize imageUrl as an empty string

  previewImage(event) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.imageUrl = reader.result as string;
    }

    reader.readAsDataURL(file);
    this.imageFile = event.target.files[0];

  }

  add() {

    if (this.soldForm.valid) {

      const soldProduct: SoldProduct = {
        id: 1,
        ref: this.soldForm.value.ref,
        name: this.soldForm.value.name,
        price: this.soldForm.value.price,
        category: this.selectedCategory3,
        stockEquivalents: this.newStockEquivalents
      }

      console.log(soldProduct);

      this.soldService.addSoldProduct(this.establishmentId, soldProduct)
        .subscribe(
          (sp: SoldProduct) => {
            console.log('Sold product added successfully:', sp);
            
            ////////////////////////////////////////////

             // Get establishment by  ID
        this.soldService.getById(sp.id).subscribe(
          (spWithId: SoldProduct) => {
            console.log('Establishment with ID:', spWithId);
  
            // Assign image to the estab
            this.soldService.addImageToSp(spWithId.id, this.imageFile).subscribe(
              (spWithImage: SoldProduct) => {
                console.log('sp with image:', spWithImage);
            
              },
              (error) => {
                console.error('Error adding image :', error);
              }
            );
          },
          (error) => {
            console.error('Error fetching sp by ID:', error);
          }
        );
            ///////////////////////////////////////////////

           this.router.navigate(['/admin/sold'])
           this.notificationService.showSuccess('','Produit ajouté  avec succés ')
          },
          (error) => {
            console.error('Error adding sold product:', error);
           this.notificationService.showError('',error);
           this.newStockEquivalents=[];
          }
        );
    }
    else {
      this.newStockEquivalents=[];
      console.error('Form is invalid. Cannot submit.');
      this.notificationService.showError('','Vous devez Remplir tous les champs')
    }

  }




edit() {

  if (this.soldForm.valid) {

    // Create SoldProduct instance
    const soldProduct: SoldProduct = {
      id: 1,
      ref: this.soldForm.value.ref,
      name: this.soldForm.value.name,
      price: this.soldForm.value.price,
      category: this.selectedCategory3,
      stockEquivalents: this.newStockEquivalents
    }



    // Display the SoldProduct instance in the console
    console.log(JSON.stringify(soldProduct));

    this.soldService.updateSoldProduct(this.soldProductId, this.establishmentId, soldProduct).subscribe(
      (updatedSoldProduct) => {
        console.log('Sold product updated:', updatedSoldProduct);
        this.updateImage();

        this.notificationService.showSuccess('','Produit modifié avec succés ')
        // Handle success if needed
      },
      (error) => {
        console.error('Error updating sold product:', error);
        this.notificationService.showError(error, 'Error'); // Display error message as toast
        this.newStockEquivalents=[];

      }
    );
  }
  else {
    this.newStockEquivalents=[];
    console.error('Form is invalid. Cannot submit.');
    this.notificationService.showError("","Formulaire invalide vérifier tous les champs");
  }

}




updateImage(): void {
  if (this.imageFile) {
    this.soldService
      .addImageToSp(this.soldProductId, this.imageFile)
      .subscribe(
        (SP: SoldProduct) => {
          console.log('SP with image:', SP);
          this.router.navigate(['/admin/sold']);
        },
        (error) => {
          console.error('Error adding image:', error);
        }
      );
  } else {
    console.log('No image selected. Skipping update.');
    this.router.navigate(['/admin/sold']);
  }
}

}
