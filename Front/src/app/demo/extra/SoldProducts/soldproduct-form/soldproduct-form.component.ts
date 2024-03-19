import { Component, OnInit } from '@angular/core';
import { SoldServices } from '../service/soldservice';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Category, SoldProduct, StockEquivalent, StockProduct } from '../../Stock/service/models';
import { StockServices } from '../../Stock/service/stockService';

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

  constructor(
    private stockService: StockServices,
    private soldService: SoldServices,
    private route: ActivatedRoute,
    private router: Router
  ) { }



  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.establishmentId = params['estabid'];
      if (this.establishmentId) {
        this.fetchStockProducts(this.establishmentId);
        this.fetchCategories(this.establishmentId);
      }
    });
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

  // This method is called when the input field for adding a new category changes
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
  selectedStockProducts: StockProduct[] = [];

  onCategorySelect(category: Category): void {
    if (this.selectedCategory3 === category) {
      this.selectedCategory3 = null; // Deselect the category if it's already selected
    } else {
      this.selectedCategory3 = category;
    }
    console.log("Selected category:", this.selectedCategory3);
  }


  selectedSoldProductIndices: number[] = [];

  onStockProductSelect(stockProduct: StockProduct,index: number): void {
    if (this.selectedStockProducts.includes(stockProduct)) {
      this.selectedStockProducts = this.selectedStockProducts.filter(stock => stock !== stockProduct);
    } else {
      this.selectedStockProducts.push(stockProduct);
    }
    console.log("Selected stock products:", this.selectedStockProducts);

    const selectedIndex = this.selectedSoldProductIndices.indexOf(index);
  if (selectedIndex !== -1) {
    // If selected, remove it from the array
    this.selectedSoldProductIndices.splice(selectedIndex, 1);
  } else {
    // If not selected, add it to the array
    this.selectedSoldProductIndices.push(index);
  }
  console.log("Selected sold product indices:", this.selectedSoldProductIndices);
  }


  selectedQuantities: number[] = [];
  stockEquivalents: StockEquivalent[] = []
  


  submitted: boolean = false;
  newSoldProduct: SoldProduct = {
    id:1,
    ref: '',
    name: '',
    price: 0,
    category: null,
    stockEquivalents: []
  };

  onSubmit(): void {

    console.log("list of indexes ", this.selectedSoldProductIndices);
    // Check if any of the form fields is empty
    if (!this.newSoldProduct.ref || !this.newSoldProduct.name || !this.newSoldProduct.price) {
      alert('Please fill in all fields.');
      return;
    }
  
    // Check if a category is selected
    if (!this.selectedCategory3) {
      alert('Please select a category.');
      return;
    }
  
    // Check if there is at least one stock equivalent and validate quantities
    if (this.selectedStockProducts.length === 0) {
      alert('Please select at least one stock product.');
      return;
    }
    else{console.log(this.selectedStockProducts);}

  
    // Create stock equivalents
    const newStockEquivalents: StockEquivalent[] = [];
    
    // Loop through selected stock products and their quantities
    for (let i = 0; i < this.selectedStockProducts.length; i++) {
      const stockProduct = this.selectedStockProducts[i];
      const quantity = this.selectedQuantities[ this.selectedSoldProductIndices[i]];
      console.log("selected quant"+quantity+" id:"+i);
      // Check if quantity is missing
      if (!quantity || isNaN(quantity)) {
        alert('Please enter a valid quantity for all selected stock products.');
        return;
      }
  
      // Create new stock equivalent
      const stockEquivalent: StockEquivalent = {
        quantity: quantity,
        stockproduct: stockProduct
      };

  
      // Add it to the list of stock equivalents
      newStockEquivalents.push(stockEquivalent);
      console.log("list of created SE  :   "+newStockEquivalents.length);
    }
  
    // Create SoldProduct instance
    const soldProduct: SoldProduct = {
      id:1,
      ref: this.newSoldProduct.ref,
      name: this.newSoldProduct.name,
      price: this.newSoldProduct.price,
      category: this.selectedCategory3,
      stockEquivalents: newStockEquivalents
    };
  
    // Display the SoldProduct instance in the console
    console.log(soldProduct);

    this.soldService.addSoldProduct(this.establishmentId, soldProduct)
      .subscribe(
        (response) => {
          console.log('Sold product added successfully:', response);
          console.log("aaaaaaa");
          this.router.navigate(['/admin/sold'])
          // Handle success, if needed
        },
        (error) => {
          console.error('Error adding sold product:', error);
          // Handle error, if needed
        }
      );

  }
  

}


/*createStockEquivalents(): void {
    const newStockEquivalents: StockEquivalent[] = [];
    let hasInvalidQuantity = false; // Flag to track if any invalid quantities were found

    // Loop through selected stock products and their quantities
    for (let i = 0; i < this.selectedStockProducts.length; i++) {
      const stockProduct = this.selectedStockProducts[i];
      const quantity = this.selectedQuantities[i];

      // Check if quantity is empty or not a number
      if (!quantity || isNaN(quantity)) {
        // Set the flag to true to indicate that an invalid quantity was found
        hasInvalidQuantity = true;
        // Skip this stock product
        continue;
      }

      // Create new stock equivalent
      const stockEquivalent: StockEquivalent = {
        quantity: quantity,
        stockProduct: stockProduct
      };

      // Add it to the list of stock equivalents
      newStockEquivalents.push(stockEquivalent);
    }

    if (hasInvalidQuantity) {
      // Display error message and deny creation of stock equivalents
      alert('Please enter valid quantities for all selected stock products.');
      return; // Exit the method without adding any stock equivalents
    }

    // Add the new stock equivalents to the existing list
    this.stockEquivalents = this.stockEquivalents.concat(newStockEquivalents);


    console.log(this.stockEquivalents);
  }*/
