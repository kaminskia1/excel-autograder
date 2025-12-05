import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../models/user/user.service';
import { IUser, UserCredentials, UserCredentialsNew } from '../../../models/user/user';

interface RegisterForm {
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup<RegisterForm>;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {
    this.registerForm = new FormGroup<RegisterForm>({
      username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.snackBar.open('Error creating account!', 'Close', { duration: 1500 });
    } else {
      const formData: UserCredentialsNew = {
        username: this.registerForm.controls.username.value,
        email: this.registerForm.controls.email.value,
        password: this.registerForm.controls.password.value,
        confirmPassword: this.registerForm.controls.confirmPassword.value,
      };
      this.userService.register(formData).subscribe((response: IUser) => {
        if (response) {
          const credentials: UserCredentials = {
            username: formData.username,
            password: formData.password,
          };
          this.userService.login(credentials);
        }
      });
    }
  }
}
