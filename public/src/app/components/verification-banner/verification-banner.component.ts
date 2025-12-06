import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UserService } from '../../models/user/user.service';
import { User } from '../../models/user/user';

@Component({
  selector: 'app-verification-banner',
  templateUrl: './verification-banner.component.html',
  styleUrls: ['./verification-banner.component.scss'],
})
export class VerificationBannerComponent implements OnInit, OnDestroy {
  user: User | null = null;
  isDismissed = false;
  isResending = false;
  private userSubscription?: Subscription;
  private previousUserId: string | null = null;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.getUser$().subscribe((user) => {
      // Reset dismissed state when user changes (different user or logged out/in)
      const currentUserId = user?.uuid ?? null;
      if (currentUserId !== this.previousUserId) {
        this.isDismissed = false;
        this.previousUserId = currentUserId;
      }
      
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  get shouldShow(): boolean {
    return !!(this.user && !this.user.emailVerified && !this.isDismissed);
  }

  dismiss(): void {
    this.isDismissed = true;
  }

  resendVerification(): void {
    this.isResending = true;
    this.userService.resendVerification().subscribe({
      next: () => {
        this.snackBar.open('Verification email sent!', 'Close', { duration: 3000 });
        this.isResending = false;
      },
      error: (err) => {
        const message = err.error?.error || 'Failed to send email. Please try again later.';
        this.snackBar.open(message, 'Close', { duration: 5000 });
        this.isResending = false;
      },
    });
  }
}

