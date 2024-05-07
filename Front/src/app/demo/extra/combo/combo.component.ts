import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { EstablishmentService } from '../establishments/Service/EstablishmentService';
import { Router } from '@angular/router';
import { ComboService } from './comboService';
import { Establishment } from '../establishments/Service/establishment.model';
import { Combo } from '../Stock/service/models';
import { NotificationService } from '../notificationService';

@Component({
  selector: 'app-combo',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './combo.component.html',
  styleUrl: './combo.component.scss'
})
export class ComboComponent {





  constructor(private notificationService:NotificationService,private establishmentService: EstablishmentService, private router: Router, private comboService:ComboService) { }
  ngOnInit() {


    this.fetchEstablishments();


  }



  establishments: Establishment[] = [];

  combos:   Combo[] = [];

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




  currentCombos: any[] = []; // Sold products for the current page
  currentPage: number = 1;
  combosPerPage: number = 3;
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




  fetchCombos(id: number) {

    console.log(id);

    this.comboService.getAllCombosByEstablishmentId(id).subscribe((data) => { this.combos = data; this.selectedEstablishment = this.establishments.find(establishment => establishment.id === id);
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

  openAddCombo(estabid:number) {

    this.router.navigate(['/admin/comboF', { estabid: estabid }])
  }

  onEdit(estabid:number,id: number): void {
    this.router.navigate(['/admin/comboF', { id: id ,estabid: estabid}]);
 }



 onDelete(id:number,estabid:number){

  this.comboService.deleteCombo(id).subscribe(
    () => { console.log("stock product deleted"+ id);
      this.load(estabid);
      this.notificationService.showInfo('','combo supprimé')
    },
    (error) => {
      console.error('Error ', error);
    }
  );
 }

 load(id :number){

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
