import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../models/user/user.service';
import { UserCredentials } from '../../models/user/user';

enum PAGE {
  LOGIN= 'Log In',
  REGISTER = 'Register',
  RESET = 'Reset'
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  page: PAGE = PAGE.LOGIN;

  logInForm;

  failedLogin = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.logInForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  onSubmit(formData: Partial<UserCredentials>): void {
    if (this.logInForm.invalid) {
      this.failedLogin = true;
      this.snackBar.open('Error signing in!', 'Close', { duration: 1500 });
    } else {
      this.userService.login(formData as UserCredentials).subscribe({
        error: () => {
          this.failedLogin = true;
          this.logInForm.controls.password.setValue('');
          this.snackBar.open('Error signing in!', 'Close', { duration: 1500 });
        },
      });
    }
  }

  protected readonly PAGE = PAGE;
}
