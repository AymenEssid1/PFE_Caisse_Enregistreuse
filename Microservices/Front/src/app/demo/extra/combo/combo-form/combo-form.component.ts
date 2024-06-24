import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SoldServices } from '../../SoldProducts/service/soldservice';
import { ActivatedRoute, Router } from '@angular/router';
import { Combo, SoldProduct } from '../../Stock/service/models';
import { ComboService } from '../comboService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../notificationService';

@Component({
  selector: 'app-combo-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './combo-form.component.html',
  styleUrl: './combo-form.component.scss'
})
export class ComboFormComponent {

  constructor(private notificationService:NotificationService,private formBuilder: FormBuilder,private soldService:SoldServices, private router:Router, private route:ActivatedRoute,private comboService:ComboService){}

  EstabId:number;
  CombotId:number;
  filteredSoldProducts: SoldProduct[] = [];

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

  searchText: string = ''; // Holds the search input value

  searchSoldProducts(): void {
    if (!this.searchText) {
      // If search text is empty, show all sold products
      this.filteredSoldProducts = this.soldProducts;
    } else {
      // Filter sold products based on search text
      this.filteredSoldProducts = this.soldProducts.filter(product =>
        product.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        product.ref.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

 soldProducts:SoldProduct[]
  fetchSoldProducts(establishmentId: number) {
    this.soldService.getAllSoldProducts(establishmentId).subscribe(
      (data) => {
        this.soldProducts = data;
        this.filteredSoldProducts = this.soldProducts;

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
      this.notificationService.showError('Verifier les données du formulaire', 'Erreur'); // Display error message as toast

    }

  }

  edit(): void {
    if (this.comboForm.valid) {

      if (this.selectedSoldProductIds.length<2){
        this.notificationService.showError('Vous devez sélectionner au moins 2 produits pour créer un combo', 'Erreur'); // Display error message as toast
        return;
      }
      const updatedCombo: Combo = {
        id: this.CombotId,
        ref: this.comboForm.value.ref,
        name: this.comboForm.value.name,
        price: this.comboForm.value.price,
        status:false,

        soldProducts: this.selectedSoldProductIds.map(id => {
          return new SoldProduct({ id }); // Construct SoldProduct objects with only the ID property
        })
      };
  
      this.comboService.updateCombo(updatedCombo.id,updatedCombo).subscribe(
        (updatedCombo) => {
          console.log('Combo updated successfully.',updatedCombo);
          // Optionally, navigate to another page or perform other actions upon successful update
         
            this.updateImage();

          //////////11
        },
        error => {
          console.error('Error updating combo:', error);
        this.notificationService.showError(error, 'Erreur'); // Display error message as toast
        }
      );
    } else {
      console.error('Form is invalid. Cannot submit.');
      this.notificationService.showError('Verifier les données du formulaire', 'Erreur'); // Display error message as toast

    }
  }
  
  imageFile: File; 


  onFileSelected(event: any): void {
    this.imageFile = event.target.files[0];
  }

  add(){

    if (this.comboForm.valid) {

      if (this.selectedSoldProductIds.length<2){
        this.notificationService.showError('Vous devez sélectionner au moins 2 produits pour créer un combo', 'Erreur'); // Display error message as toast
        return;
      }
      const addedCombo = {
        
        ref: this.comboForm.value.ref,
        name: this.comboForm.value.name,
        price: this.comboForm.value.price,
        status:false,

        soldProducts: this.selectedSoldProductIds.map(id => {
          return new SoldProduct({ id }); // Construct SoldProduct objects with only the ID property
        })      };

        console.log(JSON.stringify(addedCombo));
  
      this.comboService.createCombo(addedCombo).subscribe(
        (sp: Combo) => {
          console.log('Combo created successfully.');
          ////////////////////////////////////////////
         

             // Get establishment by  ID
        this.comboService.getComboById(sp.id).subscribe(
          (spWithId: Combo) => {
            console.log('Establishment with ID:', spWithId);
  
            // Assign image to the estab
            this.comboService.addImageToSp(spWithId.id, this.imageFile).subscribe(
              (spWithImage: Combo) => {
                console.log('sp with image:', spWithImage);
                this.router.navigate(['/admin/combo'])
                this.notificationService.showSuccess('','Combo ajouté')
            
              },
              (error) => {
                console.error('Error adding image :', error);
              }
            );
          },
          (error) => {
            console.error('Error fetching combo by ID:', error);
          }
        );
            ///////////////////////////////////////////////
          
        },
        error => {
          console.error('Error creating combo:', error);
          this.notificationService.showError(error, 'Error'); // Display error message as toast

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
  

  updateImage(): void {
    if (this.imageFile) {
      this.comboService
        .addImageToSp(this.CombotId, this.imageFile)
        .subscribe(
          (SP: Combo) => {
            console.log('SP with image:', SP);
               
            this.router.navigate(['/admin/combo']);
            this.notificationService.showSuccess('','Combo modifié')
          },
          (error) => {
            console.error('Error adding image:', error);
          }
        );
    } else {
      console.log('No image selected. Skipping update.');
      this.router.navigate(['/admin/combo']);
      this.notificationService.showSuccess('','Combo modifié')

    }
  }



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


}
