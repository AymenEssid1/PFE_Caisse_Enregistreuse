import { Component, HostListener } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SessionSelectionService } from '../session/SessionSelectionService';
import { Client, Order, PayType, Payment } from '../Stock/service/models';
import { NavigationStart, Router, CanDeactivate, ActivatedRoute } from '@angular/router';
import { EstablishmentService } from '../establishments/Service/EstablishmentService';
import { ClientsComponent } from './clients/clients.component';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { ClientService } from './clients/clientService';
import { OrderService } from './orderService';
import { SessionService } from '../session/sessionService';
import { NotificationService } from '../notificationService';



@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [SharedModule,ClientsComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {


  savedOrder: Order;
  navigateByButton = false;
  private navigationSubscription;
  constructor(
    private sessionSelectionService: SessionSelectionService,
    private establishmentService: EstablishmentService,
    private orderService:OrderService,
    private sessionService:SessionService,
    private router: Router,
    private clientService:ClientService,
    private notificationService:NotificationService,
    private route: ActivatedRoute

  ) {

    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (!this.navigateByButton) {
          const confirmLeave = confirm('la commande sera annulée ');
          if (confirmLeave) {
            this.sessionSelectionService.deleteOrder();
            this.sessionSelectionService.clearOrder();
          } else {
            this.router.navigate([], { skipLocationChange: true });
          }

        }
      }
    });


  }


  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if (this.clientSubscription) {
      this.clientSubscription.unsubscribe();
    }
  }

  fidelityOrNo:boolean;
  priceToPay:number;

  orderId: string | null = null;
  lang: string | null = null;

 
  client: Client;
  private clientSubscription: Subscription;
  ngOnInit() {
    this.clientSubscription = this.sessionSelectionService.client$.subscribe(client => {
      this.client = client;
      console.log('Client:', this.client);
    });
    this.savedOrder = this.sessionSelectionService.getOrder();
    this.priceToPay=this.savedOrder.totalPrice;
    console.log(this.savedOrder);
    const ESTABID= Number(localStorage.getItem('establishmentId'))


    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] || null;
      this.lang = params['lang'] || null;

      if (this.orderId) {
        // Call checkOrderStatus if orderId is present in the URL
        this.checkOrderStatus(this.orderId);
       //console.log("clickto pay order id ",this.orderId);
      }else{console.log("no click to pay id presnt");}
    });
    this.fidelityCheck(ESTABID);
    
  }

 


pointsAcquired:number;
equivalent:number;
fidelityRatio:number;

   fidelityCheck(id: number): void {
    this.establishmentService.getEstablishmentById(id).subscribe(
      establishment => {
       this.fidelityOrNo=establishment.fidelitySystem;
       if(this.fidelityCheck){

        this.pointsAcquired=establishment.fidelityRatio*this.priceToPay;
        this.equivalent=establishment.cashOutRatio;
        this.fidelityRatio=establishment.fidelityRatio;
       }
       console.log(this.fidelityOrNo);
      },
      error => {
        console.error('Error fetching establishment details:', error);
      }
    );
  }


 


  navigateToPos(): void {
    this.navigateByButton = true;
    this.router.navigate(['/admin/pos']);
  }


  isModalOpen = false;
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }





  cashOut(): void {
    if (this.client) {
      const oldFidelityPoints = this.client.fidelityPoints;
      let newFidelityPoints: number;
      const equivalentPointsValue = oldFidelityPoints * this.equivalent;
  
      if (this.savedOrder.totalPrice > equivalentPointsValue) {
        newFidelityPoints = 0;
        this.priceToPay = this.savedOrder.totalPrice - equivalentPointsValue;
      } else {
        console.log("old value",oldFidelityPoints);
        console.log("points spent",this.savedOrder.totalPrice * this.fidelityRatio);
        newFidelityPoints = oldFidelityPoints - (this.savedOrder.totalPrice * this.fidelityRatio);
        console.log(newFidelityPoints);

        this.priceToPay = 0;
      }
  
      this.clientService.updateFidelityPoints(this.client.id, newFidelityPoints).subscribe(
        (updatedClient) => {
          console.log('Fidelity points updated:', updatedClient);
          this.client = updatedClient;
          this.sessionSelectionService.setClient(updatedClient);
          this.pointsAcquired = this.priceToPay * this.fidelityRatio;
        },
        (error) => {
          console.error('Error updating fidelity points:', error);
        }
      );
    }
  }
  



  promptCashPayment(): void {
    Swal.fire({
      title: 'Entrez le montant reçu',
      html: `
        <input type="number" id="received-amount" class="swal2-input" placeholder="Montant reçu">
        <div id="change-display" style="margin-top: 10px; font-size: 1.2em;"></div>
      `,
      confirmButtonText: 'Payer',
      showCancelButton: true,
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const receivedAmount = parseFloat((document.getElementById('received-amount') as HTMLInputElement).value);
        if (isNaN(receivedAmount) || receivedAmount <= 0) {
          Swal.showValidationMessage('Veuillez entrer un montant valide');
          return false;
        }
        // Check if received amount is sufficient
        const totalPrice = this.priceToPay;
        if (receivedAmount >= totalPrice) {
          return receivedAmount;
        } else {
          Swal.showValidationMessage('Le montant reçu est insuffisant');
          return false;
        }
      },
      didOpen: () => {
        const receivedAmountInput = document.getElementById('received-amount') as HTMLInputElement;
        const changeDisplay = document.getElementById('change-display');
  
        receivedAmountInput.addEventListener('input', () => {
          const receivedAmount = parseFloat(receivedAmountInput.value);
          if (!isNaN(receivedAmount) && receivedAmount > 0) {
            const change = this.calculateChange(receivedAmount);
            changeDisplay.innerText = `Monnaie à rendre: ${change} Dt`;
          } else {
            changeDisplay.innerText = '';
          }
        });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const receivedAmount = result.value;
        const change = this.calculateChange(receivedAmount);
        console.log(`Montant reçu: ${receivedAmount}, Monnaie: ${change}`);
         // Call your payment processing function here
         this.payByCash();
      }
    });
  }
  
  
  calculateChange(receivedAmount: number): number {
    const totalPrice = this.priceToPay; // Ensure this is set correctly
    const change = receivedAmount - totalPrice;
    return change > 0 ? change : 0;
  }

  payByCash(): void {
    this.createPayment(PayType.CASH);
  }

  payByCard(): void {
    const amount =this.priceToPay;
    this.goToClickToPay(amount,PayType.CARD);
  }

  
  private createPayment(payType: PayType): void {
    const payment: Payment = {
      
      payType: payType,
      status: true,
      orderId:  this.savedOrder.id ,
      clientId: this.client ? this.client.id : -1,
      paidAmount:this.priceToPay,
      establishmentId: Number(localStorage.getItem('establishmentId')),
      
    };

    console.log(JSON.stringify(payment));

    this.clientService.createPayment(payment).subscribe(
      response => {
        
       
        if(this.client){
          const newpoints=this.pointsAcquired+this.client.fidelityPoints;
          this.clientService.updateFidelityPoints(this.client.id, newpoints).subscribe(
            (updatedClient) => {
              console.log('Fidelity points updated:', updatedClient);
              this.client = updatedClient;
              this.sessionSelectionService.setClient(updatedClient);
            },
            error => {
              console.error('Error updating fidelity points:', error);
            }
          );
        }
       
        const SESSIONID = this.sessionSelectionService.getSelectedSession().id;
        const ORDERID=this.sessionSelectionService.getOrder().id
        this.updateExpectedMoney(SESSIONID,this.priceToPay);
        this.updateOrderStatus(ORDERID,true);
        
        
      },
      error => {
        console.error('Error creating payment', error);
        // Handle error in payment creation
      }
    );
  }




  updateOrderStatus(orderId: number, newStatus: boolean): void {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe(
      response => {
        console.log('Order status updated successfully',response);
        
        
        if(response.tableId){

          this.establishmentService.adjustTableStatus(response.tableId,true).subscribe(response =>{},error=> {
            console.error('Error updating order status:', error);
            
          }
          )
        }
        this.navigateToPos();
        setTimeout(() => {
          this.sessionSelectionService.clearClient();
        this.sessionSelectionService.clearOrder();
        }, 200);  
      },
      error => {
        console.error('Error updating order status:', error);
        // Handle error
      }
    );
  }

  updateExpectedMoney(sessionId: number, newExpectedMoney: number): void {
    this.sessionService.updateExpectedMoney(sessionId, newExpectedMoney).subscribe(
      response => {
        console.log('Expected money updated successfully',response);
        // Handle success
      },
      error => {
        console.error('Error updating expected money:', error);
        // Handle error
      }
    );
  }
  



    goToClickToPay(amount: number,payType: PayType) {
      const ORDERID=this.sessionSelectionService.getOrder().id;
      // Generate 7 random digits
      const randomDigits = Math.floor(10000 + Math.random() * 9000000);
      const orderNumber = `${ORDERID}${randomDigits}`;
      const paymentRequest = {
        amount: amount,
        orderNumber: orderNumber,
        returnUrl: 'http://localhost:4200/payment',
        failUrl: 'http://localhost:4200/payment'
      };
        this.clientService.externalPayment(paymentRequest).subscribe(
        (response) => {

          console.log('Payment initiated successfully:', response.formUrl);
          this.navigateByButton=true;
          const url=response.formUrl;
          console.log(url);
          window.location.href = url; // Redirect to the payment URL
        },
        (error) => {
          console.error('Error initiating payment:', error);
        }
      );
    }


    checkOrderStatus(orderId: string) {
      this.clientService.checkOrderStatus(orderId).subscribe(
        (response) => {
          const ORDERSTATUS = response.OrderStatus;
          const ERRORCODE =  response.ErrorCode;
          if (ORDERSTATUS==2 && ERRORCODE== 0){

            this.createPayment(PayType.CASH);



          }

          else{
            this.notificationService.showError("Erreur","paiement invalide réessayer")
          }
          // Handle the order status response here
        },
        (error) => {
          console.error('Error checking order status:', error);
        }
      );
    }

  
  

}
