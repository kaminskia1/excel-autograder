import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UserService } from './user.service';
import { ApiService } from '../../services/api/api.service';
import { UserFactory } from './user.factory';
import { CookieService } from '../../core/services';

describe('UserService', () => {
  let service: UserService;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [ApiService, UserFactory, UserService, CookieService],
    });
    cookieService = TestBed.inject(CookieService);
    // Clear any existing auth token before each test
    cookieService.delete('auth_token');
    service = TestBed.inject(UserService);
  });

  afterEach(() => {
    cookieService.delete('auth_token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be logged in initially', () => {
    cookieService.delete('auth_token');
    expect(service.isLoggedIn()).toBeFalse();
  });
});
