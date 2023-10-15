import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/api/auth-service/auth.service';

interface UserCredentials {
  username: string|null
  password: string|null
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  logInForm;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.logInForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(formData: Partial<UserCredentials>): void {
    if (this.logInForm.invalid) {
      console.log(this.logInForm.errors);
    } else if ('username' in formData && formData.username != null && 'password' in formData && formData.password != null) {
      this.authService.login(formData.username, formData.password);
    }
  }
}
