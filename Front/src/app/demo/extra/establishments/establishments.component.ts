import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Establishment } from './Service/establishment.model';
import { EstablishmentService } from './Service/EstablishmentService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-establishments',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './establishments.component.html',
  styleUrl: './establishments.component.scss'
})
export class EstablishmentsComponent {

  establishments: Establishment[] = [];


  constructor(private establishmentService: EstablishmentService,private router:Router) {}

  ngOnInit(): void {
    this.fetchEstablishments();
  }

  openAddEstablishment(): void {
    console.log("hello");
    this.router.navigate(['/admin/addestablishments'])
  }

  onEdit(id: number): void {
    this.router.navigate(['/admin/addestablishments', { id: id }]);
}

  fetchEstablishments() {
    this.establishmentService.getAllEstablishments().subscribe(
      (data) => {
        this.establishments = data;
      },
      (error) => {
        console.error('Error fetching establishments', error);
      }
    );
  }

  

  onDelete(id: number): void {
    this.establishmentService.deleteEstablishment(id)
      .subscribe(
        () => { console.log("establishment deleted");
this.load();
        },
        (error) => {
          console.error('Error deleting establishment:', error);
        }
      );
  }

  load():void{

    this.fetchEstablishments();
   
  }

}
