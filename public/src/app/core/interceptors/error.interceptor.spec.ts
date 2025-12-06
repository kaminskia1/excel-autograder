import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  HttpClient,
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorInterceptor } from './error.interceptor';
import { CookieService } from '../services';

describe('ErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let cookieService: CookieService;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CookieService,
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    cookieService = TestBed.inject(CookieService);
  });

  afterEach(() => {
    httpMock.verify();
    cookieService.delete('auth_token');
  });

  describe('401 Unauthorized errors', () => {
    it('should clear auth_token cookie on 401 error', fakeAsync(() => {
      cookieService.set('auth_token', 'test-token');

      httpClient.get('/api/v1/assignments/').subscribe({
        error: () => {},
      });

      const req = httpMock.expectOne('/api/v1/assignments/');
      req.flush({ detail: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
      tick();

      expect(cookieService.get('auth_token')).toBeNull();
    }));

    it('should redirect to login on 401 error', fakeAsync(() => {
      httpClient.get('/api/v1/assignments/').subscribe({
        error: () => {},
      });

      const req = httpMock.expectOne('/api/v1/assignments/');
      req.flush({ detail: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
      tick();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should show session expired snackbar on 401 error', fakeAsync(() => {
      httpClient.get('/api/v1/assignments/').subscribe({
        error: () => {},
      });

      const req = httpMock.expectOne('/api/v1/assignments/');
      req.flush({ detail: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
      tick();

      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Session expired. Please log in again.',
        'Close',
        jasmine.objectContaining({ duration: 5000 }),
      );
    }));
  });

  describe('403 Forbidden errors', () => {
    it('should show permission denied snackbar on 403 error', fakeAsync(() => {
      httpClient.get('/api/v1/assignments/123/').subscribe({
        error: () => {},
      });

      const req = httpMock.expectOne('/api/v1/assignments/123/');
      req.flush({ detail: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });
      tick();

      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'You do not have permission to access this resource.',
        'Close',
        jasmine.objectContaining({ duration: 5000 }),
      );
    }));

    it('should NOT redirect to login on 403 error', fakeAsync(() => {
      httpClient.get('/api/v1/assignments/123/').subscribe({
        error: () => {},
      });

      const req = httpMock.expectOne('/api/v1/assignments/123/');
      req.flush({ detail: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });
      tick();

      expect(routerSpy.navigate).not.toHaveBeenCalled();
    }));
  });

  describe('404 Not Found errors', () => {
    it('should show not found snackbar on 404 error', fakeAsync(() => {
      httpClient.get('/api/v1/assignments/nonexistent/').subscribe({
        error: () => {},
      });

      const req = httpMock.expectOne('/api/v1/assignments/nonexistent/');
      req.flush({ detail: 'Not found' }, { status: 404, statusText: 'Not Found' });
      tick();

      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'The requested resource was not found.',
        'Close',
        jasmine.objectContaining({ duration: 5000 }),
      );
    }));
  });

  describe('5xx Server errors', () => {
    it('should show server error snackbar on 500 error', fakeAsync(() => {
      httpClient.get('/api/v1/assignments/').subscribe({
        error: () => {},
      });

      const req = httpMock.expectOne('/api/v1/assignments/');
      req.flush({ detail: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
      tick();

      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'A server error occurred. Please try again later.',
        'Close',
        jasmine.objectContaining({ duration: 5000 }),
      );
    }));

    it('should show server error snackbar on 502 error', fakeAsync(() => {
      httpClient.get('/api/v1/assignments/').subscribe({
        error: () => {},
      });

      const req = httpMock.expectOne('/api/v1/assignments/');
      req.flush({ detail: 'Bad gateway' }, { status: 502, statusText: 'Bad Gateway' });
      tick();

      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'A server error occurred. Please try again later.',
        'Close',
        jasmine.objectContaining({ duration: 5000 }),
      );
    }));

    it('should show server error snackbar on 503 error', fakeAsync(() => {
      httpClient.get('/api/v1/assignments/').subscribe({
        error: () => {},
      });

      const req = httpMock.expectOne('/api/v1/assignments/');
      req.flush({ detail: 'Service unavailable' }, { status: 503, statusText: 'Service Unavailable' });
      tick();

      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'A server error occurred. Please try again later.',
        'Close',
        jasmine.objectContaining({ duration: 5000 }),
      );
    }));

    it('should show server error snackbar on 504 error', fakeAsync(() => {
      httpClient.get('/api/v1/assignments/').subscribe({
        error: () => {},
      });

      const req = httpMock.expectOne('/api/v1/assignments/');
      req.flush({ detail: 'Gateway timeout' }, { status: 504, statusText: 'Gateway Timeout' });
      tick();

      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'A server error occurred. Please try again later.',
        'Close',
        jasmine.objectContaining({ duration: 5000 }),
      );
    }));
  });

  describe('auth endpoint exclusions', () => {
    it('should NOT show snackbar for login endpoint errors', fakeAsync(() => {
      httpClient.post('/api/v1/auth/login/', { username: 'test', password: 'wrong' }).subscribe({
        error: () => {},
      });

      const req = httpMock.expectOne('/api/v1/auth/login/');
      req.flush({ detail: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
      tick();

      expect(snackBarSpy.open).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    }));

    it('should NOT show snackbar for register endpoint errors', fakeAsync(() => {
      httpClient.post('/api/v1/auth/register/', { username: 'test', password: 'pass' }).subscribe({
        error: () => {},
      });

      const req = httpMock.expectOne('/api/v1/auth/register/');
      req.flush({ detail: 'Username already exists' }, { status: 400, statusText: 'Bad Request' });
      tick();

      expect(snackBarSpy.open).not.toHaveBeenCalled();
    }));

    it('should NOT clear cookie or redirect for auth/me endpoint errors', fakeAsync(() => {
      cookieService.set('auth_token', 'test-token');

      httpClient.get('/api/v1/auth/me/').subscribe({
        error: () => {},
      });

      const req = httpMock.expectOne('/api/v1/auth/me/');
      req.flush({ detail: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
      tick();

      // Cookie should NOT be cleared for auth/me errors (let UserService handle it)
      expect(cookieService.get('auth_token')).toBe('test-token');
      expect(snackBarSpy.open).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    }));
  });

  describe('error re-throwing', () => {
    it('should re-throw error for component-level handling', fakeAsync(() => {
      let caughtError: HttpErrorResponse | null = null;

      httpClient.get('/api/v1/assignments/').subscribe({
        error: (error) => {
          caughtError = error;
        },
      });

      const req = httpMock.expectOne('/api/v1/assignments/');
      req.flush({ detail: 'Not found' }, { status: 404, statusText: 'Not Found' });
      tick();

      expect(caughtError).not.toBeNull();
      expect(caughtError!.status).toBe(404);
    }));

    it('should re-throw error even for unhandled status codes', fakeAsync(() => {
      let caughtError: HttpErrorResponse | null = null;

      httpClient.get('/api/v1/assignments/').subscribe({
        error: (error) => {
          caughtError = error;
        },
      });

      const req = httpMock.expectOne('/api/v1/assignments/');
      req.flush({ detail: 'Bad request' }, { status: 400, statusText: 'Bad Request' });
      tick();

      expect(caughtError).not.toBeNull();
      expect(caughtError!.status).toBe(400);
      // Should not show snackbar for 400 (unhandled status)
      expect(snackBarSpy.open).not.toHaveBeenCalled();
    }));
  });

  describe('successful requests', () => {
    it('should pass through successful responses without modification', fakeAsync(() => {
      let response: any = null;

      httpClient.get('/api/v1/assignments/').subscribe({
        next: (data) => {
          response = data;
        },
      });

      const req = httpMock.expectOne('/api/v1/assignments/');
      req.flush({ id: 1, name: 'Test Assignment' });
      tick();

      expect(response).toEqual({ id: 1, name: 'Test Assignment' });
      expect(snackBarSpy.open).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    }));
  });
});
