import { Component } from '@angular/core';
import { UserService } from './userService';
import { EstablishmentService } from '../establishments/Service/EstablishmentService';
import { Establishment } from '../establishments/Service/establishment.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cashiers',
  
  templateUrl: './cashiers.component.html',
  styleUrl: './cashiers.component.scss'
})
export class CashiersComponent {

  constructor(private userService: UserService, private establishmentService :EstablishmentService,private router: Router) { }

  dataSource: any[] = [];

  ngOnInit(): void {
    this.load();
  }

  load():void{

    this.loadRoles();
    this.fetchEstablishments();
    this.fetchUsers();
  }


  fetchUsers():void{
    this.userService.GetAllUsers().subscribe(
      (users) => {
        this.dataSource = users;
        this.fetchRolesForUsers();
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );


  }
  reloadComponent(): void {
    const currentRoute = this.router.url.split('?')[0];
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRoute]);
    });
  }

  fetchRolesForUsers(): void {
    this.dataSource.forEach((user) => {
      this.userService.getUserRoles(user.id).subscribe(
        (roles) => {
          user.roles = roles;
        },
        (error) => {
          console.error(`Error fetching roles for user ${user.id}:`, error);
        }
      );
    });
  }


 

  deleteRole(userId: string, realmMapping: any): void {
    this.userService.deleteRoleMapping(userId, realmMapping).subscribe(
      () => {
        console.log(`Role ${realmMapping.name} deleted successfully for user ${userId}`);
        this.load();
      },
      error => {
        console.error(`Error deleting role ${realmMapping.name} for user ${userId}:`, error);
      }
    );
  }

    establishments: Establishment[] = [];

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
getEstablishmentName(establishmentId: string): string {
  let numberValue: number = +establishmentId;

  const establishment = this.establishments.find(est => est.id === numberValue);
  return establishment ? establishment.name : 'non défini';
}


roles: any[] = [];

loadRoles(): void {
  this.userService.getRealmRoles().subscribe(
    roles => {
      this.roles = roles.filter(role => !["offline_access", "default-roles-pfe", "uma_authorization"].includes(role.name));
      console.log('Filtered roles:', this.roles.map(role => role.name));

    },
    error => {
      console.error('Error fetching roles:', error);
    }
  );
}




// Inside your component class
assignRole(userId: string, role: any): void {
  // Call the userService's assignRole method
  this.userService.assignRole(userId, role).subscribe(
    (response) => {
      console.log(`Role ${role.name} assigned successfully to user ${userId}`);
      this.load();
    },
    (error) => {
      console.error(`Error assigning role ${role.name} to user ${userId}:`, error);
      // Handle the error as needed
    }
  );
}


assignEstablishment(userId:string, establishmentId:string){
  this.userService.updateEstablishmentId(userId.toString(), establishmentId.toString()).subscribe(
    () => {
      console.log('Establishment ID updated successfully');
      this.load();
    
    },
    error => {
      console.error('Error updating establishment ID:', error);
    }
  );
}









}
