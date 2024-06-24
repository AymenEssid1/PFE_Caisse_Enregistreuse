import { Injectable, EventEmitter  } from '@angular/core';
import { Client, StompConfig } from '@stomp/stompjs';
import { LoginService } from '../../pages/authentication/auth-signin/loginService';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private stompClient: Client;
  private roles: string[];
  private establishmentId: string;


  public newMessage: EventEmitter<any> = new EventEmitter();


  constructor(private loginService: LoginService,private http: HttpClient) { }

  initializeWebSocketConnection() {
    const token = localStorage.getItem('token');
    const decodedToken = this.loginService.parseJwt(token);

    this.roles = decodedToken.realm_access.roles;
    this.establishmentId = String(decodedToken.establishmentId);  // Ensure establishmentId is a string

    //console.log('Initialized WebSocketService with establishmentId:', this.establishmentId);
    //console.log('User roles:', this.roles);

    const config: StompConfig = {
      brokerURL: 'ws://localhost:8085/gateway/NOTIFICATION/wss', 
      connectHeaders: {},
      heartbeatIncoming: 1000,
      heartbeatOutgoing: 20000,
      reconnectDelay: 5000,
      debug: (msg: string) => {
        console.log(msg);
      },
    };

    this.stompClient = new Client(config);
    this.stompClient.onConnect = () => {
      this.getMessage();
    };
    this.stompClient.activate();
  }

  getMessage() {
    const roomTopic = `/topic/room/1`;
    this.stompClient.subscribe(roomTopic, (message) => {
      this.handleIncomingMessage(message.body);
    });
  }

  handleIncomingMessage(message: any) {
    const parsedMessage = JSON.parse(message);
    const messageEstablishmentId = String(parsedMessage.establishmentId);  // Ensure message establishmentId is a string

    //console.log('Parsed message:', parsedMessage);
    //console.log('Message establishmentId:', messageEstablishmentId);

    if (this.roles.includes('Developper') || this.roles.includes('ADMIN')) {
     // console.log('Received message from server:', parsedMessage);
      this.newMessage.emit("x");
    } else if (this.roles.includes('Gérant')) {
      //console.log('Comparing establishment IDs:', this.establishmentId, messageEstablishmentId);
      if (this.establishmentId === messageEstablishmentId) {
        //console.log('Received message for Gérant from server:', parsedMessage);
        this.newMessage.emit(this.establishmentId);
      } else {
        //console.log('Message ignored due to establishment ID mismatch.');
      }
    }
  }






  token = localStorage.getItem("token")
  
  
   
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
  };

  private baseUrl: string = 'http://localhost:8085/gateway/NOTIFICATION/notification';


  getAllNotifications() {
    return this.http.get<any[]>(`${this.baseUrl}/all`, this.httpOptions);
  }

  getNotificationsByEstablishmentId(establishmentId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/establishment/${establishmentId}`, this.httpOptions);
  }

  deleteNotification(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, this.httpOptions);
  }

  deleteAllNotifications() {
    return this.http.delete(`${this.baseUrl}/all`, this.httpOptions);
  }
}
