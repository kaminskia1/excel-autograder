import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UserService } from './user.service';
import { ApiService } from '../../services/api/api.service';
import { UserFactory } from './user.factory';
import { CookieService } from '../../core/services';
import { User } from './user';
import { API_URL } from '../../config/api.config';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let cookieService: CookieService;
  const baseUrl = API_URL;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [ApiService, UserFactory, UserService, CookieService],
    });
    httpMock = TestBed.inject(HttpTestingController);
    cookieService = TestBed.inject(CookieService);
    // Clear any existing auth token before each test
    cookieService.delete('auth_token');
    service = TestBed.inject(UserService);
  });

  afterEach(() => {
    httpMock.verify();
    cookieService.delete('auth_token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be logged in initially', () => {
    cookieService.delete('auth_token');
    expect(service.isLoggedIn()).toBeFalse();
  });

  describe('Email Verification Methods', () => {
    describe('verifyEmail', () => {
      it('should call the verify-email endpoint with token', () => {
        const testToken = 'test-verification-token-123';
        
        service.verifyEmail(testToken).subscribe((response) => {
          expect(response.message).toBe('Email verified successfully');
        });

        const req = httpMock.expectOne(`${baseUrl}auth/verify-email/${testToken}/`);
        expect(req.request.method).toBe('GET');
        req.flush({ message: 'Email verified successfully' });
      });

      it('should handle verification error', () => {
        const testToken = 'expired-token';
        
        service.verifyEmail(testToken).subscribe({
          error: (err) => {
            expect(err.error.error).toBe('Verification link has expired');
          }
        });

        const req = httpMock.expectOne(`${baseUrl}auth/verify-email/${testToken}/`);
        req.flush({ error: 'Verification link has expired' }, { status: 400, statusText: 'Bad Request' });
      });
    });

    describe('resendVerification', () => {
      it('should call the resend-verification endpoint', () => {
        service.resendVerification().subscribe((response) => {
          expect(response.message).toBe('Verification email sent');
        });

        const req = httpMock.expectOne(`${baseUrl}auth/resend-verification/`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({});
        req.flush({ message: 'Verification email sent' });
      });

      it('should handle rate limit error', () => {
        service.resendVerification().subscribe({
          error: (err) => {
            expect(err.status).toBe(429);
          }
        });

        const req = httpMock.expectOne(`${baseUrl}auth/resend-verification/`);
        req.flush(
          { error: 'Please wait 10m 0s before requesting another email' },
          { status: 429, statusText: 'Too Many Requests' }
        );
      });
    });

    describe('changeEmail', () => {
      it('should call the change-email endpoint with new email', () => {
        const newEmail = 'newemail@example.com';
        
        service.changeEmail(newEmail).subscribe((response) => {
          expect(response.message).toBe('Verification email sent to your new email address');
          expect(response.pending_email).toBe(newEmail);
        });

        const req = httpMock.expectOne(`${baseUrl}auth/change-email/`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ new_email: newEmail });
        req.flush({ 
          message: 'Verification email sent to your new email address',
          pending_email: newEmail 
        });
      });

      it('should handle email already in use error', () => {
        service.changeEmail('taken@example.com').subscribe({
          error: (err) => {
            expect(err.error.error).toBe('This email is already in use');
          }
        });

        const req = httpMock.expectOne(`${baseUrl}auth/change-email/`);
        req.flush({ error: 'This email is already in use' }, { status: 400, statusText: 'Bad Request' });
      });
    });

    describe('cancelEmailChange', () => {
      it('should call the cancel-email-change endpoint', () => {
        service.cancelEmailChange().subscribe((response) => {
          expect(response.message).toBe('Email change cancelled');
        });

        const req = httpMock.expectOne(`${baseUrl}auth/cancel-email-change/`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({});
        req.flush({ message: 'Email change cancelled' });
      });

      it('should handle no pending email error', () => {
        service.cancelEmailChange().subscribe({
          error: (err) => {
            expect(err.error.error).toBe('No pending email change to cancel');
          }
        });

        const req = httpMock.expectOne(`${baseUrl}auth/cancel-email-change/`);
        req.flush({ error: 'No pending email change to cancel' }, { status: 400, statusText: 'Bad Request' });
      });
    });

    describe('refreshUser', () => {
      it('should return null if no current user', (done) => {
        service.refreshUser().subscribe((result) => {
          expect(result).toBeNull();
          done();
        });
      });
    });

    describe('getUser$', () => {
      it('should return an observable of the current user', (done) => {
        service.getUser$().subscribe((user) => {
          expect(user).toBeNull(); // Initially null
          done();
        });
      });
    });
  });
});
