import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule,SharedModule,RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  password:string="";
  confirmPassword:string="";
  
  naviagteToLogin(){}


}
