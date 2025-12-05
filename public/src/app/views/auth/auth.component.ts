import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../models/user/user.service';
import { UserCredentials } from '../../models/user/user';

enum PAGE {
  LOGIN= 'Log In',
  REGISTER = 'Register',
  RESET = 'Reset'
}

interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
  rememberMe: FormControl<boolean>;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  page: PAGE = PAGE.LOGIN;

  logInForm: FormGroup<LoginForm>;

  failedLogin = false;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.logInForm = new FormGroup<LoginForm>({
      username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      rememberMe: new FormControl(false, { nonNullable: true }),
    });
  }

  onSubmit(): void {
    if (this.logInForm.invalid) {
      this.failedLogin = true;
      this.snackBar.open('Error signing in!', 'Close', { duration: 1500 });
    } else {
      const credentials: UserCredentials = {
        username: this.logInForm.controls.username.value,
        password: this.logInForm.controls.password.value,
      };
      this.userService.login(credentials).subscribe({
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
