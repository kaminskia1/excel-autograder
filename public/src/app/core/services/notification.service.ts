import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'info';

const DEFAULT_DURATIONS: Record<NotificationType, number> = {
  success: 3000,
  error: 5000,
  info: 3000,
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show a success notification.
   */
  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  /**
   * Show an error notification.
   */
  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  /**
   * Show an info notification.
   */
  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  /**
   * Show a notification with the specified type.
   */
  private show(message: string, type: NotificationType, duration?: number): void {
    const config: MatSnackBarConfig = {
      duration: duration ?? DEFAULT_DURATIONS[type],
      panelClass: [`snackbar-${type}`],
    };
    this.snackBar.open(message, 'Close', config);
  }
}
