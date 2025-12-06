import {
  ComponentFixture, TestBed, fakeAsync, tick, flush,
} from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { VerifyEmailComponent } from './verify-email.component';
import { UserService } from '../../models/user/user.service';

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let activatedRouteMock: { snapshot: { paramMap: any } };

  const setupTestBed = async (token: string | null = 'valid-token') => {
    const userSpy = jasmine.createSpyObj('UserService', [
      'verifyEmail',
      'resendVerification',
      'refreshUser',
      'isLoggedIn',
    ]);
    const routeSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    userSpy.refreshUser.and.returnValue(of(null));

    activatedRouteMock = {
      snapshot: {
        paramMap: convertToParamMap({ token }),
      },
    };

    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      declarations: [VerifyEmailComponent],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: Router, useValue: routeSpy },
        { provide: MatSnackBar, useValue: snackSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;
  };

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', async () => {
    await setupTestBed();
    userServiceSpy.verifyEmail.and.returnValue(of({ message: 'Success' }));
    expect(component).toBeTruthy();
  });

  describe('ngOnInit with valid token', () => {
    beforeEach(async () => {
      await setupTestBed('valid-token');
    });

    it('should call verifyEmail with token on init', fakeAsync(() => {
      userServiceSpy.verifyEmail.and.returnValue(of({ message: 'Email verified' }));
      fixture.detectChanges();
      tick();

      expect(userServiceSpy.verifyEmail).toHaveBeenCalledWith('valid-token');
      flush(); // Clear any pending timers (redirect setTimeout)
    }));

    it('should set success state on successful verification', fakeAsync(() => {
      userServiceSpy.verifyEmail.and.returnValue(of({ message: 'Email verified successfully!' }));
      fixture.detectChanges();
      tick();

      expect(component.state).toBe('success');
      expect(component.message).toBe('Email verified successfully!');
      expect(userServiceSpy.refreshUser).toHaveBeenCalled();
      flush(); // Clear any pending timers (redirect setTimeout)
    }));

    it('should navigate to dashboard after successful verification', fakeAsync(() => {
      userServiceSpy.verifyEmail.and.returnValue(of({ message: 'Success' }));
      fixture.detectChanges();
      tick(3000);

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    }));

    it('should set expired state on expired token error', fakeAsync(() => {
      userServiceSpy.verifyEmail.and.returnValue(
        throwError(() => ({ error: { error: 'Verification link has expired' } })),
      );
      fixture.detectChanges();
      tick();

      expect(component.state).toBe('expired');
      expect(component.message).toBe('This verification link has expired.');
      flush(); // Clear any pending timers
    }));

    it('should set invalid state on other verification errors', fakeAsync(() => {
      userServiceSpy.verifyEmail.and.returnValue(
        throwError(() => ({ error: { error: 'Invalid token' } })),
      );
      fixture.detectChanges();
      tick();

      expect(component.state).toBe('invalid');
      expect(component.message).toBe('Invalid token');
      flush(); // Clear any pending timers
    }));
  });

  describe('ngOnInit with no token', () => {
    beforeEach(async () => {
      await setupTestBed(null);
    });

    it('should set invalid state when no token provided', () => {
      fixture.detectChanges();

      expect(component.state).toBe('invalid');
      expect(component.message).toBe('Invalid verification link.');
    });
  });

  describe('resendVerification', () => {
    beforeEach(async () => {
      await setupTestBed();
      userServiceSpy.verifyEmail.and.returnValue(of({ message: 'Success' }));
      fixture.detectChanges();
    });

    it('should navigate to login if not logged in', () => {
      userServiceSpy.isLoggedIn.and.returnValue(false);

      component.resendVerification();

      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Please log in to resend verification email.',
        'Close',
        jasmine.objectContaining({ duration: 5000 }),
      );
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should call resendVerification if logged in', fakeAsync(() => {
      userServiceSpy.isLoggedIn.and.returnValue(true);
      userServiceSpy.resendVerification.and.returnValue(of({ message: 'Sent' }));

      component.resendVerification();
      tick();

      expect(userServiceSpy.resendVerification).toHaveBeenCalled();
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Verification email sent!',
        'Close',
        jasmine.objectContaining({ duration: 3000 }),
      );
      expect(component.isResending).toBeFalse();
    }));

    it('should handle resend error', fakeAsync(() => {
      userServiceSpy.isLoggedIn.and.returnValue(true);
      userServiceSpy.resendVerification.and.returnValue(
        throwError(() => ({ error: { error: 'Rate limited' } })),
      );

      component.resendVerification();
      tick();

      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Rate limited',
        'Close',
        jasmine.objectContaining({ duration: 5000 }),
      );
      expect(component.isResending).toBeFalse();
    }));
  });

  describe('Navigation methods', () => {
    beforeEach(async () => {
      await setupTestBed();
      userServiceSpy.verifyEmail.and.returnValue(of({ message: 'Success' }));
      fixture.detectChanges();
    });

    it('goToLogin should navigate to /login', () => {
      component.goToLogin();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('goToDashboard should navigate to /', () => {
      component.goToDashboard();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
