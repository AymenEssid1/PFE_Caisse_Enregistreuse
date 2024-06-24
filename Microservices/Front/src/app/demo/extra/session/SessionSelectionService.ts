import { Injectable } from "@angular/core";
import { Client, Item, Order, Session } from "../Stock/service/models";
import { OrderService } from "../payment/orderService";
import { BehaviorSubject } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class SessionSelectionService {
  selectedSession: Session;

  constructor(private orderService: OrderService) { }

  setSelectedSession(session: Session) {
    this.selectedSession = session;
    localStorage.setItem('session', JSON.stringify(session));
  }

  getSelectedSession(): Session {
    if (!this.selectedSession) {
      const sessionJson = localStorage.getItem('session');
      if (sessionJson) {
        this.selectedSession = JSON.parse(sessionJson);
      }
    }
    return this.selectedSession;
  }

  clearSelectedSession() {
    this.selectedSession = null;
    localStorage.removeItem('session');
  }



  savedOrder: Order
  setOrder(order: Order) {
    this.savedOrder = order;
    localStorage.setItem('order', JSON.stringify(order));
  }

  getOrder(): Order {
    if (!this.savedOrder) {
      const orderJson = localStorage.getItem('order');
      if (orderJson) {
        this.savedOrder = JSON.parse(orderJson);
      }
    }
    return this.savedOrder;
  }

  clearOrder() {
    this.savedOrder = null;
    localStorage.removeItem('order');
  }



  private clientSubject = new BehaviorSubject<Client>(null);
  client$ = this.clientSubject.asObservable();

  setClient(client: Client) {
    this.clientSubject.next(client);
    localStorage.setItem('client', JSON.stringify(client));
  }

  getClient(): Client {
    const client = this.clientSubject.value;
    if (!client) {
      const clientJson = localStorage.getItem('client');
      if (clientJson) {
        const client = JSON.parse(clientJson);
        this.clientSubject.next(client);
      }
    }
    return this.clientSubject.value;
  }

  clearClient() {
    localStorage.removeItem('client');
    this.clientSubject.next(null);
    
  }
  





  deleteOrder() {
    if (this.savedOrder && this.savedOrder.id) {
      this.orderService.deleteOrder(this.savedOrder.id).subscribe(
        () => {
          console.log('Order deleted successfully');
          this.savedOrder = null;
        },
        error => {
          console.error('Error deleting order:', error);
        }
      );
    } else {
      console.warn('No order to delete');
    }
  }
}