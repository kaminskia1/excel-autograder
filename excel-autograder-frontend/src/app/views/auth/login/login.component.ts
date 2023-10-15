import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../models/user/user.service';

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

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {
    this.logInForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(formData: Partial<UserCredentials>): void {
    if (this.logInForm.invalid) {
      this.snackBar.open(JSON.stringify(this.logInForm.errors), 'Close', { duration: 1500 });
    } else if ('username' in formData && formData.username != null && 'password' in formData && formData.password != null) {
      this.userService.login(formData.username, formData.password);
    }
  }
}
