// angular import
import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakRoles } from 'keycloak-js';
import { Session } from 'src/app/demo/extra/Stock/service/models';
import { UserService } from 'src/app/demo/extra/cashiers/userService';
import { SessionService } from 'src/app/demo/extra/session/sessionService';
import { WebSocketService } from 'src/app/demo/extra/stats/WebsocketService';
import { LoginService } from 'src/app/demo/pages/authentication/auth-signin/loginService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
})
export class NavRightComponent implements OnInit{

  constructor(private loginService: LoginService,private sessionService: SessionService, private webSocketService:WebSocketService) {

    this.notifications = [];    // Array to store notifications

  }

  userInfo: { firstName: string, lastName: string, realmRoles:string[]};
  notifications: any[];  // Array to store notifications

  

  ngOnInit(): void {
   this.getUserInfo2();
   this.load();

   this.webSocketService.initializeWebSocketConnection();

   this.webSocketService.newMessage.subscribe(message => {
    this.addNotification(message);
  });
  }

  notificationCount: number = 0;


  



// Modifiez la méthode addNotification pour gérer l'incrémentation du compteur de notifications
addNotification(message) {
  console.log(message);

  if(message=="x"){

    this.loadAllNotifications();
  }else{
    this.loadNotificationsByEstablishmentId(message);

  }
  
  
}


private roles: string[];
  private establishmentId: string;

load(){


  const token = localStorage.getItem('token');
    const decodedToken = this.loginService.parseJwt(token);

    this.roles = decodedToken.realm_access.roles;
    this.establishmentId = String(decodedToken.establishmentId); 


    if (this.roles.includes('Developper') || this.roles.includes('ADMIN')) {
      this.loadAllNotifications();
    } else if (this.roles.includes('Gérant')) {
      this.loadNotificationsByEstablishmentId(Number(this.establishmentId));

       
     }else{}

  
}


loadAllNotifications() {
  this.webSocketService.getAllNotifications().subscribe(
    (notifications: any[]) => {
      this.notifications = notifications.reverse();
      this.notificationCount=this.notifications.length;
    },
    (error) => {
      console.error('Error fetching all notifications:', error);
    }
  );
}

loadNotificationsByEstablishmentId(establishmentId: number) {
  this.webSocketService.getNotificationsByEstablishmentId(establishmentId).subscribe(
    (notifications: any[]) => {
      this.notifications = notifications.reverse();
      this.notificationCount=this.notifications.length;
    },
    (error) => {
      console.error('Error fetching notifications by establishment ID:', error);
    }
  );
}

deleteNotificationById(notificationId: number) {
  this.webSocketService.deleteNotification(notificationId).subscribe(
    () => {
      // Notification deleted successfully, handle UI changes if needed
    },
    (error) => {
      console.error('Error deleting notification:', error);
    }
  );
}

deleteAllNotifications() {
  this.webSocketService.deleteAllNotifications().subscribe(
    () => {
      this.load();
    },
    (error) => {
      console.error('Error deleting all notifications:', error);
    }
  );
}


  
  


  firstName: string;
  lastName: string;
  realmRoles: string[];

  getUserInfo2(): void {
    const userInfo = this.getUserInfo();
    if (userInfo) {
      this.firstName = userInfo.firstName;
      this.lastName = userInfo.lastName;
      this.realmRoles = userInfo.realmRoles.filter(role => 
        role !== 'default-roles-pfe' && 
        role !== 'uma_authorization' && 
        role !== 'offline_access'
      );
    } else {
      // Handle case when user info is not available
    }
  }

  getUserInfo(): { firstName: string, lastName: string, realmRoles: string[] } {
    const token = localStorage.getItem('token');
    const roles = JSON.parse(localStorage.getItem('roles'));

    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));

      const firstName = tokenPayload.given_name || '';
      const lastName = tokenPayload.family_name || '';
      const realmRoles = roles || [];

      return { firstName, lastName, realmRoles };
    } else {
      // Handle case when token is not present
      return null;
    }
  }
  

  openSessions: Session[] = [];


  loadOpenSessions() {
    const token = localStorage.getItem('token');
    const parts = token.split('.');
    const decoded = {
      header: JSON.parse(atob(parts[1])),
    };
    const Username = decoded.header.preferred_username;
    console.log(Username);
    this.sessionService.getSessionsByCashier(Username).subscribe(
      (data: Session[]|null) => {


        if (data === null) {
          // Directly logout if data is null
          this.loginService.logout();
          return;
        }
        this.openSessions = data.filter(session => session.status);
        console.log(JSON.stringify(this.openSessions));
        if (this.openSessions.length > 0) {
          Swal.fire('Alerte', 'Vous avez une session ouverte. Veuillez la fermer avant de vous déconnecter.', 'error');
          return;
          
        }
        this.loginService.logout();

      },
      (error) => {
        console.error('Error fetching sessions', error);
      }
    );
  }

  logout() {

    this.loadOpenSessions();
    
  }



}
