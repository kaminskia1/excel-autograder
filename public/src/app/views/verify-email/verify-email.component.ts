import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../core/services';
import { UserService } from '../../models/user/user.service';

type VerificationState = 'loading' | 'success' | 'expired' | 'invalid';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  state: VerificationState = 'loading';

  message = '';

  isResending = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');

    if (!token) {
      this.state = 'invalid';
      this.message = 'Invalid verification link.';
      return;
    }

    this.verifyToken(token);
  }

  private verifyToken(token: string): void {
    this.userService.verifyEmail(token).subscribe({
      next: (response) => {
        this.state = 'success';
        this.message = response.message || 'Email verified successfully!';

        // Refresh user data to update email_verified status
        this.userService.refreshUser().subscribe();

        // Redirect to dashboard after a delay
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (err) => {
        const errorMessage = err.error?.error || 'Verification failed.';

        if (errorMessage.toLowerCase().includes('expired')) {
          this.state = 'expired';
          this.message = 'This verification link has expired.';
        } else {
          this.state = 'invalid';
          this.message = errorMessage;
        }
      },
    });
  }

  resendVerification(): void {
    if (!this.userService.isLoggedIn()) {
      this.notification.error('Please log in to resend verification email.');
      this.router.navigate(['/login']);
      return;
    }

    this.isResending = true;
    this.userService.resendVerification().subscribe({
      next: () => {
        this.notification.success('Verification email sent!');
        this.isResending = false;
      },
      error: (err) => {
        const message = err.error?.error || 'Failed to send email.';
        this.notification.error(message);
        this.isResending = false;
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToDashboard(): void {
    this.router.navigate(['/']);
  }
}
