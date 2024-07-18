import { Component } from '@angular/core';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Issue, Session } from '../Stock/service/models';
import Swal from 'sweetalert2';
import { SessionService } from './sessionService';
import { MatTabsModule } from '@angular/material/tabs';
import { SessionSelectionService } from './SessionSelectionService';
import { Router } from '@angular/router';
import { OrderService } from '../payment/orderService';





@Component({
  selector: 'app-session',
  standalone: true,
  imports: [SharedModule,MatTabsModule],
  templateUrl: './session.component.html',
  styleUrl: './session.component.scss'
})
export class SessionComponent {
  openSessions: Session[] = [];
  closedSessions: Session[] = [];

  estabId = localStorage.getItem('establishmentId');
  token = localStorage.getItem('token')
  constructor(private sessionService: SessionService,
    private sessionSelectionService:SessionSelectionService, 
    private router: Router,
    private orderService:OrderService,
  ) {}

  selectSession(session: Session) {
    this.sessionSelectionService.setSelectedSession(session);
    this.router.navigate(['/admin/pos']); // Adjust the route as per your application
  }

  
  ngOnInit() {
    //this.loadSessionsByEstablishmentId(Number(this.estabId));  // Example establishment ID
    this.loadSessionsByCashier();
  }

  /*loadSessionsByEstablishmentId(establishmentId: number) {
    this.sessionService.getSessionsByEstablishmentId(establishmentId).subscribe(
      (data: Session[]) => {
        this.openSessions = data.filter(session => session.status);
        this.closedSessions = data.filter(session => !session.status);
       
      },
      (error) => {
        console.error('Error fetching sessions', error);
      }
    );
  }*/
 loadSessionsByCashier() {

  const parts = this.token.split('.');
    const decoded = {
      header: JSON.parse(atob(parts[1])),
    };
    const Username = decoded.header.preferred_username
    this.sessionService.getSessionsByCashier(Username).subscribe(
      (data: Session[]) => {
        this.openSessions = data.filter(session => session.status);
        this.closedSessions = data.filter(session => !session.status);
       
      },
      (error) => {
        console.error('Error fetching sessions', error);
      }
    );
  }

  selectedTab: string = 'open'; // Default selected tab

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  createSession() {

    if (this.openSessions.length > 0) {
      Swal.fire('Erreur', 'Il existe une session ouverte', 'error');
      return;
    }
    Swal.fire({
      title: 'Créer une session de commandes',
      html:
        
        `<input type="number" id="startMoney" class="swal2-input" placeholder="Fond de caisse">`,
       
      focusConfirm: false,
      preConfirm: () => {
       
        const startMoney = parseFloat((document.getElementById('startMoney') as HTMLInputElement).value);

        if ( isNaN(startMoney) ) {
          Swal.showValidationMessage('il faut remlir tous les champs');
          return null;
        }

        return { startMoney };
      }
    }).then((result) => {

      const parts = this.token.split('.');
      const decoded = {
        header: JSON.parse(atob(parts[1])),
      };
      const Username = decoded.header.preferred_username
      if (result.isConfirmed) {
        const newSession = {
         
          establishmentId:Number(this.estabId),
          cashierUsername: Username,
          startMoney: result.value.startMoney,
          startTime: result.value.startTime,
          // Initialize other fields as necessary
          status: true,
          expectedMoney: result.value.startMoney,
          actualMoney: 0,
          closeTime: null,
          orders: []
        };

        this.sessionService.createSession(newSession).subscribe(
          (createdSession: Session) => {
            this.openSessions.push(createdSession);
            Swal.fire('Session Créée', '', 'success');
            console.log(createdSession);
            this.sessionSelectionService.setSelectedSession(createdSession);
          },
          (error) => {
            Swal.fire('Error', 'Could not create session', 'error');
          }
        );
      }
    });
  }

checkUnpaidOrders(): Promise<boolean> {

  console.log(this.sessionSelectionService.getSelectedSession().id);

  return new Promise((resolve, reject) => {
    this.orderService.getNotPaidOrdersBySessionId(this.sessionSelectionService.getSelectedSession().id).subscribe(
      (response) => {
        console.log(response);
        if(response){resolve(response.length > 0);}
        else{resolve(false)}
        
      },
      (error) => {
        reject(false);
      }
    );
  });
}

  /*closeSession(sessionId: number, expectedMoney: number) {
    Swal.fire({
      title: 'Close Session',
      html:
        `<p>Expected Money: ${expectedMoney}</p>` +
        `<input type="number" id="actualMoney" class="swal2-input" placeholder="Actual Money">`,
      focusConfirm: false,
      preConfirm: () => {
        const actualMoney = parseFloat((document.getElementById('actualMoney') as HTMLInputElement).value);
        if (isNaN(actualMoney)) {
          Swal.showValidationMessage('Please enter a valid amount');
          return null;
        }
        return { actualMoney };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const actualMoney = result.value.actualMoney;

        this.sessionService.closeSession(sessionId, actualMoney).subscribe(
          () => {
            
            Swal.fire('Session Closed', '', 'success');
            //this.loadSessionsByEstablishmentId(Number(this.estabId));
            this.loadSessionsByCashier();
            this.sessionSelectionService.clearSelectedSession();
          },
          (error) => {
            console.error('Error closing session', error);
            Swal.fire('Error', 'Could not close session', 'error');
          }
        );
      }
    });
  }*/
  closeSession(sessionId: number, expectedMoney: number) {
    this.checkUnpaidOrders().then((hasUnpaidOrders) => {
      if (hasUnpaidOrders) {
        Swal.fire('Impossible de cloturer la session', 'Il existe des commandes ouvertes.', 'error');
        return;
      }
  
      // Continue with closing the session
      Swal.fire({
        title: 'Fermer la Session',
        html:
          `<p>Monnaie attendue: ${expectedMoney}</p>` +
          `<input type="number" id="actualMoney" class="swal2-input" placeholder="Actual Money">`,
        focusConfirm: false,
        preConfirm: () => {
          const actualMoney = parseFloat((document.getElementById('actualMoney') as HTMLInputElement).value);
          if (isNaN(actualMoney)) {
            Swal.showValidationMessage('Tapez un montant valide');
            return null;
          }
          return { actualMoney };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const actualMoney = result.value.actualMoney;
  
          // Determine if a note is needed
          let issueType: Issue;
          if (actualMoney > expectedMoney) {
            issueType = Issue.PLUS;
          } else if (actualMoney < expectedMoney) {
            issueType = Issue.MINUS;
          } else {
            issueType = Issue.NOISSUE;
          }
  
          if (issueType !== Issue.NOISSUE) {
            // Prompt for a note if there is an issue
            Swal.fire({
              title: 'Fermer la Session',
              html:
                `<p>Somme calculée: ${expectedMoney}</p>` +
                `<p>Somme réelle: ${actualMoney}</p>` +
                `<p>Différence detectée. Veuillez mentionner la cause</p>` +
                `<textarea id="note" class="swal2-textarea" placeholder="Tapez ici"></textarea>`,
              focusConfirm: false,
              preConfirm: () => {
                const note = (document.getElementById('note') as HTMLTextAreaElement).value.trim();
                if (note === '') {
                  Swal.showValidationMessage('Veuillez mentionner la cause');
                  return null;
                }
                return { note };
              }
            }).then((noteResult) => {
              if (noteResult.isConfirmed) {
                const note = noteResult.value.note;
                this.submitCloseSession(sessionId, actualMoney, note);
              }
            });
          } else {
            // No issue, proceed without a note
            this.submitCloseSession(sessionId, actualMoney, '');
          }
        }
      });
    }).catch((error) => {
      console.error('Error checking unpaid orders:', error);
      Swal.fire('Erreur', 'Could not check unpaid orders', 'error');
    });
  }
  
  
  private submitCloseSession(sessionId: number, actualMoney: number, note: string) {
    this.sessionService.closeSession(sessionId, actualMoney, note).subscribe(
      () => {
        Swal.fire('Session Cloturée', '', 'success');
        this.loadSessionsByCashier();
        this.sessionSelectionService.clearSelectedSession();
      },
      (error) => {
        console.error('Error closing session', error);
        Swal.fire('Error', 'Could not close session', 'error');
      }
    );
  }
  
 
  

  

}
