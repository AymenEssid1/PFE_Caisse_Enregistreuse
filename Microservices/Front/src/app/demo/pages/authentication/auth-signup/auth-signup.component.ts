import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../auth-signin/loginService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from 'src/app/demo/extra/notificationService';

@Component({
  selector: 'app-auth-signup',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss'],
})
export default class AuthSignupComponent {


  

    form: FormGroup;

  constructor(private fb: FormBuilder,private signupService : LoginService,private notificationService:NotificationService,
    private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      password: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value); 
      this.signup();
    }else{
      this.notificationService.showError("Veuillez vérifier les champs du formulaire ","erreur")
    }}


    signup(){
      const data = {
        username: this.form.get("username")?.value,
        email: this.form.get("email")?.value,
        firstName:this.form.get("firstname")?.value,
        lastName:this.form.get("lastname")?.value,
        enabled: true,
        credentials: [
          {
            type: "password",
            value: this.form.get("password")?.value,
            temporary: false
          }
        ],
       
      };
      this.signupService.register(data)
      this.router
  }




    
}
