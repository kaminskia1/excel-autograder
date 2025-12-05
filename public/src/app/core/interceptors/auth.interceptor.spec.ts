import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { CookieService } from '../services';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CookieService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
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

  describe('when user is authenticated', () => {
    beforeEach(() => {
      cookieService.set('auth_token', 'test-token-123');
    });

    it('should add Authorization header to requests', () => {
      httpClient.get('/api/v1/assignments/').subscribe();

      const req = httpMock.expectOne('/api/v1/assignments/');
      expect(req.request.headers.get('Authorization')).toBe('Token test-token-123');
      req.flush({});
    });

    it('should add Authorization header to POST requests', () => {
      httpClient.post('/api/v1/assignments/', { name: 'Test' }).subscribe();

      const req = httpMock.expectOne('/api/v1/assignments/');
      expect(req.request.headers.get('Authorization')).toBe('Token test-token-123');
      req.flush({});
    });

    it('should add Authorization header to PUT requests', () => {
      httpClient.put('/api/v1/assignments/123/', { name: 'Updated' }).subscribe();

      const req = httpMock.expectOne('/api/v1/assignments/123/');
      expect(req.request.headers.get('Authorization')).toBe('Token test-token-123');
      req.flush({});
    });

    it('should add Authorization header to DELETE requests', () => {
      httpClient.delete('/api/v1/assignments/123/').subscribe();

      const req = httpMock.expectOne('/api/v1/assignments/123/');
      expect(req.request.headers.get('Authorization')).toBe('Token test-token-123');
      req.flush({});
    });

    it('should NOT add Authorization header to login endpoint', () => {
      httpClient.post('/api/v1/auth/login/', { username: 'test', password: 'pass' }).subscribe();

      const req = httpMock.expectOne('/api/v1/auth/login/');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush({});
    });

    it('should NOT add Authorization header to register endpoint', () => {
      httpClient.post('/api/v1/auth/register/', { username: 'test', password: 'pass' }).subscribe();

      const req = httpMock.expectOne('/api/v1/auth/register/');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush({});
    });

    it('should NOT add Authorization header to reset endpoint', () => {
      httpClient.post('/api/v1/auth/reset/', { username: 'test' }).subscribe();

      const req = httpMock.expectOne('/api/v1/auth/reset/');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush({});
    });
  });

  describe('when user is not authenticated', () => {
    it('should NOT add Authorization header when no token cookie exists', () => {
      httpClient.get('/api/v1/assignments/').subscribe();

      const req = httpMock.expectOne('/api/v1/assignments/');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush({});
    });

    it('should NOT add Authorization header when token cookie is empty', () => {
      cookieService.set('auth_token', '');

      httpClient.get('/api/v1/assignments/').subscribe();

      const req = httpMock.expectOne('/api/v1/assignments/');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush({});
    });
  });

  describe('header preservation', () => {
    beforeEach(() => {
      cookieService.set('auth_token', 'test-token-123');
    });

    it('should preserve existing headers when adding Authorization', () => {
      httpClient.get('/api/v1/assignments/', {
        headers: { 'X-Custom-Header': 'custom-value' },
      }).subscribe();

      const req = httpMock.expectOne('/api/v1/assignments/');
      expect(req.request.headers.get('Authorization')).toBe('Token test-token-123');
      expect(req.request.headers.get('X-Custom-Header')).toBe('custom-value');
      req.flush({});
    });
  });

  describe('sliding expiration', () => {
    beforeEach(() => {
      cookieService.set('auth_token', 'test-token-123');
    });

    it('should refresh cookie expiration on successful authenticated request', () => {
      const setSpy = spyOn(cookieService, 'set').and.callThrough();

      httpClient.get('/api/v1/assignments/').subscribe();

      const req = httpMock.expectOne('/api/v1/assignments/');
      req.flush({ data: 'test' });

      expect(setSpy).toHaveBeenCalledWith('auth_token', 'test-token-123', 7);
    });

    it('should NOT refresh cookie on failed request', () => {
      const setSpy = spyOn(cookieService, 'set').and.callThrough();

      httpClient.get('/api/v1/assignments/').subscribe({
        error: () => {},
      });

      const req = httpMock.expectOne('/api/v1/assignments/');
      req.flush({ error: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });

      expect(setSpy).not.toHaveBeenCalled();
    });

    it('should NOT refresh cookie for public endpoints', () => {
      const setSpy = spyOn(cookieService, 'set').and.callThrough();

      httpClient.post('/api/v1/auth/login/', { username: 'test', password: 'pass' }).subscribe();

      const req = httpMock.expectOne('/api/v1/auth/login/');
      req.flush({ token: 'new-token' });

      expect(setSpy).not.toHaveBeenCalled();
    });
  });
});
