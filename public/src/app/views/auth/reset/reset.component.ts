import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserCredentialsReset } from '../../../models/user/user';
import { UserService } from '../../../models/user/user.service';

interface ResetForm {
  username: FormControl<string>;
}

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent {
  resetForm: FormGroup<ResetForm>;

  submitted = false;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {
    this.resetForm = new FormGroup<ResetForm>({
      username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    });
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.snackBar.open('Error resetting password!', 'Close', { duration: 1500 });
    } else {
      const formData: UserCredentialsReset = {
        username: this.resetForm.controls.username.value,
      };
      this.userService.reset(formData).subscribe(() => {
        this.resetForm.controls.username.setValue('');
        this.submitted = true;
      });
    }
  }
}
