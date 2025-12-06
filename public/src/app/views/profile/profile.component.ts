import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../models/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  passwordForm: FormGroup;

  emailForm: FormGroup;

  isChangingPassword = false;

  isChangingEmail = false;

  isResendingVerification = false;

  isCancellingEmailChange = false;

  hideCurrentPassword = true;

  hideNewPassword = true;

  hideConfirmPassword = true;

  constructor(
    public userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });

    this.emailForm = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]],
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    const confirmPasswordControl = form.get('confirmPassword');

    if (newPassword !== confirmPassword) {
      confirmPasswordControl?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // Clear the passwordMismatch error when passwords match
    // But preserve other errors like 'required'
    if (confirmPasswordControl?.hasError('passwordMismatch')) {
      const errors = { ...confirmPasswordControl.errors };
      // eslint-disable-next-line dot-notation
      delete errors['passwordMismatch'];
      confirmPasswordControl.setErrors(Object.keys(errors).length ? errors : null);
    }
    return null;
  }

  getUserInitial(): string {
    const username = this.userService.getUser()?.username;
    return username ? username.charAt(0).toUpperCase() : '?';
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.isChangingPassword = true;
    const { currentPassword, newPassword } = this.passwordForm.value;

    this.userService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.snackBar.open('Password changed successfully', 'Close', { duration: 3000 });
        this.passwordForm.reset();
        this.isChangingPassword = false;
      },
      error: (err) => {
        const message = err.error?.error || 'Failed to change password';
        this.snackBar.open(message, 'Close', { duration: 5000 });
        this.isChangingPassword = false;
      },
    });
  }

  onChangeEmail(): void {
    if (this.emailForm.invalid) {
      return;
    }

    this.isChangingEmail = true;
    const { newEmail } = this.emailForm.value;

    this.userService.changeEmail(newEmail).subscribe({
      next: () => {
        this.snackBar.open('Verification email sent to your new address', 'Close', { duration: 5000 });
        this.emailForm.reset();
        this.isChangingEmail = false;
        // Refresh user data to get pending_email
        this.userService.refreshUser().subscribe();
      },
      error: (err) => {
        const message = err.error?.error || 'Failed to change email';
        this.snackBar.open(message, 'Close', { duration: 5000 });
        this.isChangingEmail = false;
      },
    });
  }

  onResendVerification(): void {
    this.isResendingVerification = true;

    this.userService.resendVerification().subscribe({
      next: () => {
        this.snackBar.open('Verification email sent', 'Close', { duration: 3000 });
        this.isResendingVerification = false;
      },
      error: (err) => {
        const message = err.error?.error || 'Failed to send verification email';
        this.snackBar.open(message, 'Close', { duration: 5000 });
        this.isResendingVerification = false;
      },
    });
  }

  onCancelEmailChange(): void {
    this.isCancellingEmailChange = true;

    this.userService.cancelEmailChange().subscribe({
      next: () => {
        this.snackBar.open('Email change cancelled', 'Close', { duration: 3000 });
        this.isCancellingEmailChange = false;
        this.userService.refreshUser().subscribe();
      },
      error: (err) => {
        const message = err.error?.error || 'Failed to cancel email change';
        this.snackBar.open(message, 'Close', { duration: 5000 });
        this.isCancellingEmailChange = false;
      },
    });
  }
}
