import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../models/user/user.service';
import { UserCredentials } from '../../models/user/user';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  isLogin = true;

  logInForm;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.logInForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(formData: Partial<UserCredentials>): void {
    if (this.logInForm.invalid) {
      this.snackBar.open('Error signing in!', 'Close', { duration: 1500 });
    } else {
      this.userService.login(formData as UserCredentials);
    }
  }
}
