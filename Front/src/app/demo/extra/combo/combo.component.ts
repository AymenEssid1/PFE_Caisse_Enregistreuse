import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { EstablishmentService } from '../establishments/Service/EstablishmentService';
import { Router } from '@angular/router';
import { ComboService } from './comboService';
import { Establishment } from '../establishments/Service/establishment.model';
import { Combo } from '../Stock/service/models';

@Component({
  selector: 'app-combo',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './combo.component.html',
  styleUrl: './combo.component.scss'
})
export class ComboComponent {





  constructor(private establishmentService: EstablishmentService, private router: Router, private comboService:ComboService) { }
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


  fetchCombos(id: number) {

    console.log(id);

    this.comboService.getAllCombosByEstablishmentId(id).subscribe((data) => { this.combos = data; this.selectedEstablishment = this.establishments.find(establishment => establishment.id === id); }
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
    },
    (error) => {
      console.error('Error deleting stock product', error);
    }
  );
 }

 load(id :number){

  this.fetchCombos(id);
    
  }


}
