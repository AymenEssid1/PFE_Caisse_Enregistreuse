import { Component, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SoldServices } from '../SoldProducts/service/soldservice';
import { Category, Combo, Item, SoldProduct } from '../Stock/service/models';
import { ComboService } from '../combo/comboService';
import { POSService } from './itemService';
import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanner-qrcode';
LOAD_WASM().subscribe();
import { ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { EstablishmentService } from '../establishments/Service/EstablishmentService';
import { Establishment } from '../establishments/Service/establishment.model';


@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [SharedModule, NgxScannerQrcodeModule],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class POSComponent {


  @ViewChild('action') scanner: NgxScannerQrcodeComponent;
  constructor(private establishmentService:EstablishmentService ,private soldService: SoldServices, private comboService: ComboService, private posService: POSService) { }

  establishmentId: number;

  scannedData: string = '';

  currentEstab:Establishment;


  fetchEstablishmentDetails(id: number): void {
    this.establishmentService.getEstablishmentById(id).subscribe(
      establishment => {
        this.currentEstab=establishment;
        console.log(JSON.stringify(this.currentEstab));

      },
      error => {
        console.error('Error fetching establishment details:', error);
      }
    );
  }


  handleScannedData(data: ScannerQRCodeResult[]): void {
    if (data && data.length > 0) {
      this.scannedData = data[0].value;
      this.getSPByRef(this.establishmentId, this.scannedData)
      //console.log('Scanned Data:', this.scannedData);

      // Pause the scanner briefly
      this.scanner.pause();
      setTimeout(() => {
        this.scanner.play();
      }, 1000);
    }
  }

  ngOnInit() {




    const token = localStorage.getItem('token');

    if (token) {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const parsedPayload = JSON.parse(decodedPayload);

      this.establishmentId = parsedPayload.establishmentId;
      
      this.fetchCategories(this.establishmentId);
      this.fetchCombos(this.establishmentId);
      this.fetchSoldProducts(this.establishmentId);
      this.fetchEstablishmentDetails(this.establishmentId);
    }
    else {
      console.error('Token not found in local storage');
    }

  }

  categories: Category[] = [];





  fetchCategories(establishmentId: number): void {
    this.soldService.getAllCategories(establishmentId).subscribe(
      categories => {
        this.categories = categories;
        //this.selectedCategory = this.categories[0];
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  soldProducts: SoldProduct[];
  fetchSoldProducts(establishmentId: number) {

    this.soldService.getAllSoldProducts(establishmentId).subscribe(
      (data) => {
        this.soldProducts = data;
        //this.selectedCategory = this.categories[0];
        this.filterSoldProducts();
      },
      (error) => {
        console.error('Error fetching sold products', error);
      }
    );
  }

  combos: Combo[];
  filteredCombos: Combo[];
  fetchCombos(id: number) {

    console.log(id);

    this.comboService.getAllCombosByEstablishmentId(id).subscribe((data) => {
      this.combos = data;
      this.filteredCombos = this.combos


    }
      , (error) => { console.log('error fetching stock products', error); })
  }

  isCameraStarted: boolean = false; // Track camera state


  startCamera() {
    console.log("start");
    
      if (this.scanner && !this.isCameraStarted) {
        this.scanner.start();
        this.isCameraStarted = true;
      }
    
  }

  stopCamera() {
    console.log(this.scanner);
   
    if (this.scanner && this.isCameraStarted) {
      this.scanner.stop();
      this.isCameraStarted = false;
    }
  }

  hideDropDown: number = 1;


  toggleDropDown(option: number) {
    console.log(option);
    if (option == 3) {
      setTimeout(() => {
        this.startCamera();
      }, 100);
      
    } else {
      
      this.stopCamera();
    }
    this.hideDropDown = option;
  }

  /*hideDropDown: boolean = false;

  toggleDropDown(hide: boolean) {
      this.hideDropDown = hide;

  }*/



  filteredSoldProducts: SoldProduct[]; // Array to hold filtered sold products

  filterSoldProducts(): void {

    if (!this.selectedCategory) {
      // If no category is selected, display all sold products
      this.filteredSoldProducts = this.soldProducts;
    } else {
      // Filter sold products based on the selected category
      this.filteredSoldProducts = this.soldProducts.filter(product => product.category.id === this.selectedCategory.id);
    }
  }

  selectedCategory: Category;

  onSelectCat(catid: number) {

    if (catid === 0) {
      // If the user selects "ALL", set selectedCategory to null
      this.selectedCategory = null;
    } else {
      // Otherwise, find the selected category
      this.selectedCategory = this.categories.find(category => category.id === catid);
    }
    // Filter the sold products based on the selected category
    this.filterSoldProducts();


  }



  searchTerm: string = '';

  // Function to filter sold products or combos based on the search term
  applySearchFilter(): void {
    // If the "Produits" tab is selected
    if (this.hideDropDown == 1) {
      this.selectedCategory = null;
      this.filteredSoldProducts = this.soldProducts.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else if (this.hideDropDown == 2) {
      // If the "Combos" tab is selected
      this.filteredCombos = this.combos.filter(combo =>
        combo.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  ////////////////////////////////ORDER PART//////////////////////////////////////////////

  items: Item[] = [];
  selectedQuantity: number = 0;

  selectQuantity(number: number) {
    this.selectedQuantity = this.selectedQuantity * 10 + number; // Append the clicked number to the selected quantity
  }


  createItem(soldProductId: number, comboId: number, name: string) {
    // Check if the calculator buttons were clicked
    if (this.selectedQuantity > 0) {
      // If calculator buttons were clicked, add items with the selected quantity
      const existingItemIndex = this.items.findIndex(item => {
        return (item.soldProductId === soldProductId && soldProductId !== null) ||
          (item.comboId === comboId && comboId !== null);
      });

      if (existingItemIndex !== -1) {
        // If item already exists, update its quantity by adding the selected quantity
        this.items[existingItemIndex].quantity += this.selectedQuantity;
        const newItemData = {
          id: null,
          soldProductId: soldProductId,
          comboId: comboId,
          quantity: this.items[existingItemIndex].quantity,
          price: 10,
          order: null,
          name: name
        };

        this.posService.updateItem(this.items[existingItemIndex].id, newItemData).subscribe(
          newItem => {

            console.log(JSON.stringify(newItem));
            this.items[existingItemIndex].price = newItem.price;
          },
          error => {
            // Handle error
            console.error('Error creating item:', error);
          }
        );
      } else {
        // If item doesn't exist, create a new item with the selected quantity
        const newItemData = {
          id: null,
          soldProductId: soldProductId,
          comboId: comboId,
          quantity: this.selectedQuantity,
          price: 10,
          order: null,
          name: name
        };

        this.posService.createItem(newItemData).subscribe(
          newItem => {
            // Push the newly created item to the items array
            this.items.push(newItem);
            // Reverse the items array
            // this.items.reverse();
            //TODO FIX REVERSE ISSUE
            console.log(JSON.stringify(newItem));
          },
          error => {
            // Handle error
            console.error('Error creating item:', error);
          }
        );

      }

      this.selectedQuantity = 0;
    } else {
      //////////////////////ADD BY CLICKING MULTIPLE TIMES/////////////////////////////////////////
      // If calculator buttons were not clicked, add items with default quantity of 1
      const existingItemIndex = this.items.findIndex(item => {
        return (item.soldProductId === soldProductId && soldProductId !== null) ||
          (item.comboId === comboId && comboId !== null);
      });

      if (existingItemIndex !== -1) {
        // If item already exists, update its quantity by incrementing by 1
        this.items[existingItemIndex].quantity++;

        const newItemData = {
          id: null,
          soldProductId: soldProductId,
          comboId: comboId,
          quantity: this.items[existingItemIndex].quantity,
          price: 10,
          order: null,
          name: name
        };

        this.posService.updateItem(this.items[existingItemIndex].id, newItemData).subscribe(
          newItem => {

            console.log(JSON.stringify(newItem));
            this.items[existingItemIndex].price = newItem.price;
          },
          error => {
            // Handle error
            console.error('Error creating item:', error);
          }
        );
      } else {
        

        const newItemData = {
          id: null,
          soldProductId: soldProductId,
          comboId: comboId,
          quantity: 1,
          price: 10,
          order: null,
          name: name
        };
        console.log("before sending " + JSON.stringify(newItemData));

        this.posService.createItem(newItemData).subscribe(
          newItem => {
            // Push the newly created item to the items array
            this.items.unshift(newItem);
            // Reverse the items array
            //this.items.reverse();
            console.log(JSON.stringify(newItem));
          },
          error => {
            // Handle error
            console.error('Error creating item:', error);
          }
        );

      }
    }
  }



  clearItems(): void {
    const itemIds = this.items.map(item => item.id);

    this.posService.deleteItemsByIds(itemIds).subscribe(
      () => {
        this.items = [];
        this.selectedQuantity = 0;
      },
      error => {
        console.error('Error deleting items:', error);
      }
    );
  }

  deleteItem(itemId: number): void {
    const index = this.items.findIndex(item => item.id === itemId);
    if (index !== -1) {
        const deletedItem = this.items.splice(index, 1)[0]; // Remove the item from the array
        console.log(JSON.stringify(deletedItem));
        this.posService.deleteItemById(itemId).subscribe(
            () => { console.log("Item deleted successfully"); },
            error => {
                console.error('Error deleting item:', error);
                // If deletion fails, re-insert the deleted item into the array
                this.items.splice(index, 0, deletedItem);
            }
        );
    }
}

 /* clearLastItem(): void {
    if (this.items.length > 0) {
      const removedItem = this.items.pop();
      console.log(JSON.stringify(removedItem));
      this.posService.deleteItemById(removedItem.id).subscribe(
        () => { console.log("item deleted");},
        error => {
          // Handle error
          console.error('Error creating item:', error);
        }
      );

      // Reset selected quantity if needed
      this.selectedQuantity = 0;
    }
  }*/

  // Method to delete the last item from the list
  deleteLastInstance(): void {
    if (this.items.length > 0) {
      const lastItem = this.items[this.items.length - 1];
      if (lastItem.quantity > 1) {
        lastItem.quantity--;
        // Update the item in the backend with the new quantity
        const newItemData = {
          id: lastItem.id,
          soldProductId: null,
          comboId: null,
          quantity: lastItem.quantity,
          price: lastItem.price,
          order: lastItem.order,
          name: lastItem.name
        };
        this.posService.updateItem(lastItem.id, newItemData).subscribe(
          newItem => {
            // Item updated successfully
            lastItem.price = newItem.price;

          },
          error => {
            // Handle error
            console.error('Error updating item with new quantity:', error);
          }
        );
      } else {
        // Remove the last item from the list
        const removedItem = this.items.pop();
        console.log('Removed item:', removedItem);
        // Delete the item from the backend
        this.posService.deleteItemById(removedItem.id).subscribe(
          () => {
            console.log('Item deleted successfully');
          },
          error => {
            // Handle error
            console.error('Error deleting item:', error);
          }
        );
      }
    }
  }
  


  ////////////////////////////////////Scan by ref/////////////////////////////////////////////////
  getSPByRef(id: number, ref: string) {
    this.soldService.getByRef(id, ref)
      .subscribe(
        (data) => {
          console.log('Sold Product:', data);
          this.createItem(data.id, null, data.name);
          // Do something with the sold product data
        },
        (error) => {
          //console.error('Error:', error);
          this.comboService.getComboByRefAndEstablishmentId(ref, id)
            .subscribe(
              (data) => {
                console.log('Combo:', data);
                this.createItem(null, data.id, data.name)
                // Do something with the combo data
              },
              (error) => {
                console.error('Error:', error);
                // Handle error
              }
            );
        }
      );
  }

  getComboByRef(ref: string, establishmentId: number) {
    this.comboService.getComboByRefAndEstablishmentId(ref, establishmentId)
      .subscribe(
        (data) => {
          console.log('Combo:', data);
          // Do something with the combo data
        },
        (error) => {
          console.error('Error:', error);
          // Handle error
        }
      );
  }


  calculateTotalPrice(): number {
    // Initialize total price
    let totalPrice = 0;

    // Iterate over each item and add its price to the total price
    this.items.forEach(item => {
        totalPrice += item.price;
    });

    // Return the total price
    return totalPrice;
}




}
