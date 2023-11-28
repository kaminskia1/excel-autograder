import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../models/user/user.service';
import { IUser, UserCredentials, UserCredentialsNew } from '../../../models/user/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit(formData: Partial<UserCredentialsNew>): void {
    if (this.registerForm.invalid) {
      this.snackBar.open('Error creating account!', 'Close', { duration: 1500 });
    } else {
      this.userService.register(formData as UserCredentialsNew).subscribe((response: IUser) => {
        if (response) this.userService.login(formData as UserCredentials);
      });
    }
  }
}
