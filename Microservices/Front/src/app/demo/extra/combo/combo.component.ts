import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { EstablishmentService } from '../establishments/Service/EstablishmentService';
import { Router } from '@angular/router';
import { ComboService } from './comboService';
import { Establishment } from '../establishments/Service/establishment.model';
import { Combo } from '../Stock/service/models';
import { NotificationService } from '../notificationService';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-combo',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './combo.component.html',
  styleUrl: './combo.component.scss'
})
export class ComboComponent {


  accessVar: string
  checkRole(): void {

    const roles = JSON.parse(localStorage.getItem('roles'));
    // Check if roles include ADMIN
    const isAdmin = roles.includes('ADMIN');
    // If not admin, filter out the SuperAdmin item
    if (isAdmin) {
      this.accessVar = "admin"
      console.log("admin here");
    } else {
      this.accessVar = "peasant"
      let domEl1: HTMLElement | null = document.querySelector('#selectestab');
      domEl1 && (domEl1.style.visibility = 'hidden');

    }


  }

  constructor(private notificationService: NotificationService, private establishmentService: EstablishmentService, private router: Router, private comboService: ComboService) { }
  ngOnInit() {
    //this.fetchEstablishments();
    this.checkRole();
    if (this.accessVar === "admin") { this.fetchEstablishments(); }
    else {
      const ids = localStorage.getItem('establishmentId');
      const id = parseInt(ids, 10); // The second argument specifies the radix (base), 10 for decimal

      this.fetchEstablishmentDetails(id);
      this.fetchCombos2(id);
    }


  }



  establishments: Establishment[] = [];

  combos: Combo[] = [];

  selectedEstablishment: Establishment | null = null;


  fetchEstablishments() {
    this.establishmentService.getAllEstablishments().subscribe(
      (data) => {
        this.establishments = data;
        if (this.establishments.length > 0) {

          this.fetchCombos(this.establishments[0].id);
          this.selectedEstablishment = this.establishments[0];


        }
      },



      (error) => {
        console.error('Error fetching establishments', error);
      }
    );
  }


  fetchEstablishmentDetails(id: number): void {
    this.establishmentService.getEstablishmentById(id).subscribe(
      establishment => {
        this.establishments.push(establishment);
        console.log(this.establishments);
        this.selectedEstablishment = establishment;
        console.log(JSON.stringify(establishment));
      },
      error => {
        console.error('Error fetching establishment details:', error);
      }
    );
  }



  currentCombos: any[] = []; // Sold products for the current page
  currentPage: number = 1;
  combosPerPage: number = 5;
  totalPages: number;
  totalPagesArray: number[] = [];

  previousPage() {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.setPage(this.currentPage + 1);
    }
  }

  goToPage(page: number) {
    this.setPage(page);
  }

  setPage(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.combosPerPage;
    const endIndex = Math.min(startIndex + this.combosPerPage, this.combos.length);
    this.currentCombos = this.combos.slice(startIndex, endIndex);
  }

  fetchCombos2(id: number) {

    console.log(id);

    this.comboService.getAllCombosByEstablishmentId(id).subscribe((data) => {
      this.combos = data; 
      this.totalPages = Math.ceil(this.combos.length / this.combosPerPage);
      this.totalPagesArray = []
      // Populate totalPagesArray
      for (let i = 1; i <= this.totalPages; i++) {
        this.totalPagesArray.push(i);
      }
      // Set currentSoldProducts for the initial page
      this.setPage(1);
    }
      , (error) => { console.log('error fetching stock products', error); })
  }


  fetchCombos(id: number) {

    console.log(id);

    this.comboService.getAllCombosByEstablishmentId(id).subscribe((data) => {
      this.combos = data; this.selectedEstablishment = this.establishments.find(establishment => establishment.id === id);
      this.totalPages = Math.ceil(this.combos.length / this.combosPerPage);
      this.totalPagesArray = []
      // Populate totalPagesArray
      for (let i = 1; i <= this.totalPages; i++) {
        this.totalPagesArray.push(i);
      }
      // Set currentSoldProducts for the initial page
      this.setPage(1);
    }
      , (error) => { console.log('error fetching stock products', error); })
  }

  openAddCombo(estabid: number) {

    this.router.navigate(['/admin/comboF', { estabid: estabid }])
  }

  onEdit(estabid: number, id: number): void {
    this.router.navigate(['/admin/comboF', { id: id, estabid: estabid }]);
  }







  onDelete(id: number, estabid: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas récupérer ce combo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        // If user confirms the deletion
        this.comboService.deleteCombo(id).subscribe(
          () => {
            console.log("stock product deleted" + id);
            this.load(estabid);
            this.notificationService.showInfo('', 'combo supprimé')
          },
          (error) => {
            console.error('Error ', error);
          }
        );
      }
    });
  }

  load(id: number) {

    this.fetchCombos(id);

  }
  searchText: string = '';

  searchByName(): void {
    if (!this.searchText.trim()) {
      this.currentCombos = this.combos;
    } else {
      this.currentCombos = this.combos.filter(product =>
        product.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

}
