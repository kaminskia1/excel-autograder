import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserCredentialsNew, UserCredentialsReset } from '../../../models/user/user';
import { UserService } from '../../../models/user/user.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent {
  resetForm;

  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {
    this.resetForm = formBuilder.group({
      username: ['', Validators.required],
    });
  }

  onSubmit(formData: Partial<UserCredentialsReset>): void {
    if (this.resetForm.invalid) {
      this.snackBar.open('Error resetting password!', 'Close', { duration: 1500 });
    } else {
      this.userService.reset(formData as UserCredentialsNew).subscribe(() => {
        this.resetForm.controls.username.setValue('');
        this.submitted = true;
      });
    }
  }
}
