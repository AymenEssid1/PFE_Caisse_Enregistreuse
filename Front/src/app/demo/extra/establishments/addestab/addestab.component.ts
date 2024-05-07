import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Establishment, Tables } from '../Service/establishment.model';
import { EstablishmentService } from '../Service/EstablishmentService';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../notificationService';

@Component({
  selector: 'app-addestab',

  templateUrl: './addestab.component.html',
  styleUrl: './addestab.component.scss'
})
export class AddestabComponent {

  establishmentForm: FormGroup;
  estab: Establishment = new Establishment();
  imageFile: File;
  establishmentId: number;



  constructor(private notificationService: NotificationService,
    private formBuilder: FormBuilder, private establishmentService: EstablishmentService, private route: ActivatedRoute,

    private router: Router) {




  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.establishmentId = params['id'];
      this.initializeForm();
      if (this.establishmentId) {
        this.fetchEstablishmentDetails(this.establishmentId);
        this.getTables(this.establishmentId);
      }
    });
  }

  initializeForm(): void {
    this.establishmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      fidelityCheck: [],
      customCheck2: [],
      tableCheck: [],
      fidelityRatio: 0
    });
  }
  imageUrl: string = ''; // Initialize imageUrl as an empty string

  // Function to handle the file selection and preview
  previewImage(event) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.imageUrl = reader.result as string;
    }

    reader.readAsDataURL(file);
    this.imageFile = event.target.files[0];

  }


  onCheckboxChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log('Checkbox checked:', isChecked);
  }

  fetchEstablishmentDetails(id: number): void {
    this.establishmentService.getEstablishmentById(id).subscribe(
      establishment => {
        this.establishmentForm.patchValue({
          name: establishment.name,
          fidelityCheck: establishment.fidelitySystem,
          tableCheck: establishment.tableSystem,
          fidelityRatio: establishment.fidelityRatio

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
      this.notificationService.showError("","Formulaire invalide vérifier tous les champs")
    }
  }
  onFileSelected(event: any): void {
    // Get the selected image file
    this.imageFile = event.target.files[0];
  }

  addEstablishment(): void {

    if (!this.checkImage()) {
      return;
    }

    if (!this.checkFidelityRatio()) {
      return;
    }

    if (!this.checkTables()) {
      return;
    }


    this.estab.name = this.establishmentForm.get('name').value; // Adjust according to your form controls
    this.estab.tableSystem = this.establishmentForm.get('tableCheck').value;
    this.estab.fidelitySystem = this.establishmentForm.get('fidelityCheck').value;
    this.estab.fidelityRatio = this.establishmentForm.get('fidelityRatio').value;
    if (this.estab.fidelitySystem === false) { this.estab.fidelityRatio = 0; }
    this.estab.tables = this.tables;


    // tzid establishment
    this.establishmentService.addEstablishment(this.estab).subscribe(
      (addedEstablishment: Establishment) => {
        console.log('Establishment added:', addedEstablishment);

        // Get establishment by  ID
        this.establishmentService.getEstablishmentById(addedEstablishment.id).subscribe(
          (establishmentWithId: Establishment) => {
            console.log('Establishment with ID:', establishmentWithId);

            // Assign image to the estab
            this.establishmentService.addImageToEstab(establishmentWithId.id, this.imageFile).subscribe(
              (establishmentWithImage: Establishment) => {
                console.log('Establishment with image:', establishmentWithImage);
                this.router.navigate(['/admin/establishments']);
                this.notificationService.showSuccess("Succès","Point de vente ajouté ")
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
    this.estab.name = this.establishmentForm.get('name').value; // Adjust according to your form controls
    this.estab.tableSystem = this.establishmentForm.get('tableCheck').value;
    this.estab.fidelitySystem = this.establishmentForm.get('fidelityCheck').value;
    this.estab.tables = this.tables;
    this.estab.fidelityRatio = this.establishmentForm.get('fidelityRatio').value;

    if (!this.checkFidelityRatio()) {
      return;
    }

    if (!this.checkTables()) {
      return;
    }


    if (!this.estab.fidelitySystem) {
      this.estab.fidelityRatio = 0;
      console.log("Fidelity system is disabled.");
    }

    if (!this.estab.tableSystem) {
      // Delete all tables if table system is disabled
      this.tables.forEach(table => {
        this.deleteTables(table.id);
      });
      this.tables = []; // Clear the tables array
      console.log("Table system is disabled. All tables deleted.");
    }

    console.log(JSON.stringify(this.estab));

    this.establishmentService.updateEstablishment(this.establishmentId, this.estab).subscribe(
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

  deleteTables(id: number): void {
    this.establishmentService.deleteTable(id).subscribe(
      () => {
        console.log('Table deleted successfully. ID:', id);
      },
      error => {
        console.error('Error deleting table:', error);
      }
    );
  }



  conflictErrorMessage: string = '';

  handleConflictError(): void {
    // Set conflict error message
    this.conflictErrorMessage = 'Un autre point de vente portant ce nom existe déjà';
    this.notificationService.showError("", this.conflictErrorMessage)
  }

  updateImage(): void {
    if (this.imageFile) {
      this.establishmentService
        .addImageToEstab(this.establishmentId, this.imageFile)
        .subscribe(
          (establishmentWithImage: Establishment) => {
            console.log('Establishment with image:', establishmentWithImage);
            this.router.navigate(['/admin/establishments']);
            this.notificationService.showSuccess("Succès","Point de vente modifié ")
          },
          (error) => {
            console.error('Error adding image to establishment:', error);
          }
        );
    } else {
      console.log('No image selected. Skipping update.');
      this.router.navigate(['/admin/establishments']);
      this.notificationService.showSuccess("Succès","Point de vente modifié ")
    }
  }


  checkImage(): boolean {
    if (this.imageFile) {
      return true; // Image is selected
    } else {
      this.notificationService.showError("", "Vous devez choisir une image");
      return false; // Image is not selected
    }
  }


  // Inside your component class
  checkFidelityRatio(): boolean {
    const fidelityCheck = this.establishmentForm.get('fidelityCheck').value;
    const fidelityRatio = this.establishmentForm.get('fidelityRatio').value;


    if (fidelityCheck && fidelityRatio > 0) {
      return true; // Fidelity system is checked and fidelity ratio is greater than zero
    } else if (!fidelityCheck) {
      return true; // Fidelity system is not checked
    } else {
      this.notificationService.showError("", "Le Ratio de fidélité doint être > 0");
      return false; // Fidelity system is checked but fidelity ratio is not greater than zero
    }
  }

  checkTables(): boolean {

    const tableCheck = this.establishmentForm.get('tableCheck').value;
    if (tableCheck && this.tables.length > 0) {
      return true; // Fidelity system is checked and fidelity ratio is greater than zero
    } else if (!tableCheck) {
      return true; // Fidelity system is not checked
    } else {
      this.notificationService.showError("", "Vouz devez ajouter des tables ");
      return false; // Fidelity system is checked but fidelity ratio is not greater than zero
    }



  }



  tables: Tables[] = [];
  newTableName: string = '';
  newTableName2: string = '';

  areTablesEqual(table1: Tables | null, table2: Tables | null): boolean {
    if (table1 === null && table2 === null) {
      return true; // Both categories are null, consider them equal
    } else if (table1 === null || table2 === null) {
      return false; // One table is null while the other is not, consider them not equal
    } else {
      // Compare the properties of the two non-null table objects
      return table1.name === table2.name /* Add other properties to compare */;
    }
  }


  getTables(establishmentId: number): void {
    this.establishmentService.getTablesByEstablishmentId(establishmentId)
      .subscribe({
        next: tables => {
          this.tables = tables;
        },
        error: err => {
          console.error('Error fetching tables:', err);
        }
      });
  }


  addTable(): void {
    const newTableName = this.newTableName2.trim();
    if (!newTableName) {
      this.notificationService.showError("", 'Vous Devez choisir un nom de table.')
      console.error('Table name cannot be empty.');
      return;
    }

    if (this.tables.some(table => table.name === newTableName)) {
      console.error('Table with the same name already exists.');
      this.notificationService.showError("", 'Il existe une table avec le même nom.')
      return;
    }

    const newTable: Tables = { id: null, name: newTableName, status: true };
    this.establishmentService.createTable(newTable).subscribe(
      addedTable => {
        this.tables.push(addedTable);
        this.newTableName2 = ''; // Clear the input field after adding
      },
      error => {
        console.error('Error adding table:', error);
      }
    );
  }


  selectedTable: Tables | null = null;

  editTable(table: Tables): void {
    this.selectedTable = table;
    this.newTableName = table.name;
  }

  updateTable(): void {
    if (this.selectedTable) {
      const updatedTableName = this.newTableName.trim();
      if (!updatedTableName) {
        console.error('Table name cannot be empty.');
        return;
      }

      if (this.tables.some(table => table.name === updatedTableName && table.id !== this.selectedTable?.id)) {
        console.error('Table with the same name already exists.');
        return;
      }

      this.establishmentService.editTableName(this.selectedTable.id, updatedTableName).subscribe(
        updated => {
          console.log('Table updated successfully:', updated);
          // Refresh the categories list after updating
          const index = this.tables.findIndex(table => table.id === updated.id);
          // Update the name of the table in the tables array
          if (index !== -1) {
            this.tables[index].name = updated.name;
          }

          // Reset selectedCategory and newCategoryName
          this.selectedTable = null;
          this.newTableName = '';
        },
        error => {
          console.error('Error updating table:', error);
        }
      );
    }
  }

  deleteTable(id: number): void {
    this.establishmentService.deleteTable(id).subscribe(
      () => {
        this.tables = this.tables.filter(c => c.id !== id);
        console.log('table deleted successfully.');
      },
      error => {
        console.error('Error deleting table:', error);
      }
    );
  }

  onNewTableNameChange(event: any): void {
    this.newTableName = event.target.value;
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
