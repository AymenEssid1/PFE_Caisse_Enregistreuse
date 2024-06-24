import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { OrderService } from '../../payment/orderService';
import { SessionSelectionService } from '../../session/SessionSelectionService';
import { Router } from '@angular/router';
import { Order } from '../../Stock/service/models';
import { EstablishmentService } from '../../establishments/Service/EstablishmentService';

@Component({
  selector: 'app-open-orders',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './open-orders.component.html',
  styleUrl: './open-orders.component.scss'
})
export class OpenOrdersComponent {
  constructor(private orderService:OrderService,private router: Router,
    private sessionSelectionService: SessionSelectionService,private establishmentService :EstablishmentService){}

    notPaidOrders: Order[] = [];

    tableNames: Map<number, string> = new Map<number, string>();

    ngOnInit(): void {
      const selectedSession = this.sessionSelectionService.getSelectedSession();
      if (selectedSession && selectedSession.id) {
        this.fetchNotPaidOrders(selectedSession.id);
      }
    }
  
    fetchNotPaidOrders(sessionId: number): void {
      this.orderService.getNotPaidOrdersBySessionId(sessionId).subscribe(
        (orders) => {
          this.notPaidOrders = orders;
          this.notPaidOrders.forEach(order => {
            if (order.tableId) {
              this.fetchTableName(order.tableId);
            }
          });
          console.log(this.notPaidOrders);
        },
        (error) => {
          console.error('Error fetching not paid orders', error);
        }
      );
    }
  
    fetchTableName(tableId: number): void {
      this.establishmentService.getTableById(tableId).subscribe(
        table => {
          this.tableNames.set(tableId, table.name);
        },
        error => {
          console.error(`Error fetching table name for table ID ${tableId}:`, error);
        }
      );
    }
  
    handlePayment(order: Order): void {
      this.sessionSelectionService.setOrder(order);
      console.log(JSON.stringify(order));
      this.router.navigate(['/payment']);
    }
  
    getTableName(tableId: number): string {
      return this.tableNames.get(tableId) || 'Unknown';
    }


}
