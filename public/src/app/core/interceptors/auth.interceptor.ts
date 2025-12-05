import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookieService } from '../services';

// Cookie name for storing auth token (must match user.service.ts)
const AUTH_TOKEN_COOKIE = 'auth_token';
const AUTH_TOKEN_EXPIRY_DAYS = 7;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // Endpoints that should NOT receive auth headers
  private readonly publicEndpoints = [
    'auth/login/',
    'auth/register/',
    'auth/reset/',
  ];

  constructor(private cookieService: CookieService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip auth header for public endpoints
    if (this.publicEndpoints.some((endpoint) => req.url.includes(endpoint))) {
      return next.handle(req);
    }

    // Get token from cookie
    const token = this.cookieService.get(AUTH_TOKEN_COOKIE);
    if (!token) {
      return next.handle(req);
    }

    // Clone request and add Authorization header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Token ${token}`,
      },
    });

    // Refresh cookie expiration on successful authenticated requests (sliding expiration)
    return next.handle(authReq).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && event.ok) {
          // Refresh the cookie to extend expiration
          this.cookieService.set(AUTH_TOKEN_COOKIE, token, AUTH_TOKEN_EXPIRY_DAYS);
        }
      }),
    );
  }
}

