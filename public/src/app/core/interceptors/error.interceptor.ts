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
import { CookieService, NotificationService } from '../services';

// Cookie name for storing auth token (must match user.service.ts)
const AUTH_TOKEN_COOKIE = 'auth_token';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private notification: NotificationService,
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
            this.notification.error('Session expired. Please log in again.');
            break;
          case 403:
            this.notification.error('You do not have permission to access this resource.');
            break;
          case 404:
            this.notification.error('The requested resource was not found.');
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            this.notification.error('A server error occurred. Please try again later.');
            break;
          default:
            // For other errors, don't show a notification - let the component handle it
            break;
        }

        // Re-throw so component-level handlers can still react if needed
        return throwError(() => error);
      }),
    );
  }
}
