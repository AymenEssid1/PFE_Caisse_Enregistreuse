import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Establishment } from '../Service/establishment.model';
import { EstablishmentService } from '../Service/EstablishmentService';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-addestab',
 
  templateUrl: './addestab.component.html',
  styleUrl: './addestab.component.scss'
})
export class AddestabComponent {

  establishmentForm: FormGroup ;
  estab: Establishment = new Establishment();
  imageFile: File; 
  establishmentId: number;



  constructor(private formBuilder: FormBuilder, private establishmentService: EstablishmentService,    private route: ActivatedRoute,

    private router:Router) {

    

  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.establishmentId = params['id'];
      this.initializeForm();
      if (this.establishmentId) {
        this.fetchEstablishmentDetails(this.establishmentId);
      }
    });
  }

  initializeForm(): void {
    this.establishmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      // Add other form controls for additional fields
    });
  }

  fetchEstablishmentDetails(id: number): void {
    this.establishmentService.getEstablishmentById(id).subscribe(
      establishment => {
        this.establishmentForm.patchValue({
          name: establishment.name,
        });
      },
      error => {
        console.error('Error fetching establishment details:', error);
      }
    );
  }
  


  onSubmit(): void {
    if (this.establishmentForm.valid) {
      if (this.establishmentId) {
        this.editEstablishment();
      } else {
        this.addEstablishment();
      }
    } else {
      console.error('Form is invalid. Cannot submit.');
    }
  }
  onFileSelected(event: any): void {
    // Get the selected image file
    this.imageFile = event.target.files[0];
  }

  addEstablishment(): void {
    // Create establishment object from form values
    this.estab.name = this.establishmentForm.get('name').value; // Adjust according to your form controls
  
    // Add the establishment
    this.establishmentService.addEstablishment(this.estab).subscribe(
      (addedEstablishment: Establishment) => {
        console.log('Establishment added:', addedEstablishment);
  
        // Get the added establishment by its ID
        this.establishmentService.getEstablishmentById(addedEstablishment.id).subscribe(
          (establishmentWithId: Establishment) => {
            console.log('Establishment with ID:', establishmentWithId);
  
            // Assign the image to the establishment
            this.establishmentService.addImageToEstab(establishmentWithId.id, this.imageFile).subscribe(
              (establishmentWithImage: Establishment) => {
                console.log('Establishment with image:', establishmentWithImage);
                // Optionally, navigate to another route after successfully adding the establishment
                this.router.navigate(['/admin/establishments']);
              },
              (error) => {
                console.error('Error adding image to establishment:', error);
              }
            );
          },
          (error) => {
            console.error('Error fetching establishment by ID:', error);
          }
        );
      },
      (error) => {
        if (error.status === 409) {
          this.handleConflictError();
        } else {
          console.error('Error adding establishment:', error);
        }
      }
    );
  }
  
  editEstablishment(): void {
    const establishmentData = this.establishmentForm.value;
    this.establishmentService.updateEstablishment(this.establishmentId, establishmentData).subscribe(
      (updatedEstablishment: Establishment) => {
        console.log('Establishment updated:', updatedEstablishment);
        this.updateImage();
      },
      (error) => {
        if (error.status === 409) {
          this.handleConflictError();
        } else {
          console.error('Error updating establishment:', error);
        }
      }
    );
  }
  

  conflictErrorMessage: string = '';

  handleConflictError(): void {
    // Set conflict error message
    this.conflictErrorMessage = 'Un autre point de vente portant ce nom existe déjà';
  }
  
  updateImage(): void {
    if (this.imageFile) {
      this.establishmentService
        .addImageToEstab(this.establishmentId, this.imageFile)
        .subscribe(
          (establishmentWithImage: Establishment) => {
            console.log('Establishment with image:', establishmentWithImage);
            this.router.navigate(['/admin/establishments']);
          },
          (error) => {
            console.error('Error adding image to establishment:', error);
          }
        );
    } else {
      console.log('No image selected. Skipping update.');
      this.router.navigate(['/admin/establishments']);
    }
  }

}
