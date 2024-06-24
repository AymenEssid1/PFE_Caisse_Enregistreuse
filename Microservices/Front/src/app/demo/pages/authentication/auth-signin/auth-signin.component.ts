import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginService } from './loginService';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss'],
})
export default class AuthSigninComponent {

  username: string = '';
  password: string = '';

  constructor(private loginService: LoginService) {}

  login() {
    const data: { [key: string]: string } = {
      username: this.username,
      password: this.password,
      grant_type: 'password',
      client_id: 'pfeclient',
      client_secret: 's7KKkT1B08NDOMNROrGXbm5d2Sxb7ksd'
    };

    const body = Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
      console.log(data);

    this.loginService.login(body);
  }
}
