import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services';
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
    private notification: NotificationService,
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
      this.notification.error('Error signing in!');
    } else {
      const credentials: UserCredentials = {
        username: this.logInForm.controls.username.value,
        password: this.logInForm.controls.password.value,
      };
      this.userService.login(credentials).subscribe({
        error: () => {
          this.failedLogin = true;
          this.logInForm.controls.password.setValue('');
          this.notification.error('Error signing in!');
        },
      });
    }
  }

  protected readonly PAGE = PAGE;
}
