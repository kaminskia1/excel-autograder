import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from '../services';

// Cookie name for storing auth token (must match user.service.ts)
const AUTH_TOKEN_COOKIE = 'auth_token';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private cookieService: CookieService,
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Don't intercept auth endpoint errors (let components handle their own errors)
        if (req.url.includes('auth/login') || req.url.includes('auth/register') || req.url.includes('auth/me')) {
          return throwError(() => error);
        }

        switch (error.status) {
          case 401:
            // Unauthorized - clear auth state and redirect to login
            this.cookieService.delete(AUTH_TOKEN_COOKIE);
            this.router.navigate(['/login']);
            this.snackBar.open('Session expired. Please log in again.', 'Close', { duration: 5000 });
            break;
          case 403:
            this.snackBar.open('You do not have permission to access this resource.', 'Close', { duration: 5000 });
            break;
          case 404:
            this.snackBar.open('The requested resource was not found.', 'Close', { duration: 5000 });
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            this.snackBar.open('A server error occurred. Please try again later.', 'Close', { duration: 5000 });
            break;
          default:
            // For other errors, don't show a snackbar - let the component handle it
            break;
        }

        // Re-throw so component-level handlers can still react if needed
        return throwError(() => error);
      }),
    );
  }
}
