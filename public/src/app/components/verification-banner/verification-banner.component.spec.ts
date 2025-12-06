import {
  ComponentFixture, TestBed, fakeAsync, tick,
} from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { VerificationBannerComponent } from './verification-banner.component';
import { UserService } from '../../models/user/user.service';
import { User } from '../../models/user/user';

describe('VerificationBannerComponent', () => {
  let component: VerificationBannerComponent;
  let fixture: ComponentFixture<VerificationBannerComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let userSubject: BehaviorSubject<User | null>;

  const createMockUser = (overrides: Partial<User> = {}): User => new User({
    uuid: '123',
    username: 'testuser',
    email: 'test@example.com',
    emailVerified: false,
    pendingEmail: null,
    token: 'test-token',
    metadata: {},
    ...overrides,
  });

  beforeEach(async () => {
    userSubject = new BehaviorSubject<User | null>(null);

    const userSpy = jasmine.createSpyObj('UserService', ['getUser$', 'resendVerification']);
    const snackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    userSpy.getUser$.and.returnValue(userSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      declarations: [VerificationBannerComponent],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: MatSnackBar, useValue: snackSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture = TestBed.createComponent(VerificationBannerComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    userSubject.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to user changes', () => {
      fixture.detectChanges();
      expect(userServiceSpy.getUser$).toHaveBeenCalled();
    });

    it('should update user when user$ emits', () => {
      fixture.detectChanges();
      const mockUser = createMockUser();
      userSubject.next(mockUser);
      expect(component.user).toBe(mockUser);
    });

    it('should reset isDismissed when a different user logs in', () => {
      fixture.detectChanges();

      // First user logs in
      const userA = createMockUser({ uuid: 'user-a', emailVerified: false });
      userSubject.next(userA);

      // User A dismisses the banner
      component.isDismissed = true;
      expect(component.isDismissed).toBeTrue();

      // Different user logs in
      const userB = createMockUser({ uuid: 'user-b', emailVerified: false });
      userSubject.next(userB);

      // Banner should be reset for User B
      expect(component.isDismissed).toBeFalse();
    });

    it('should reset isDismissed when user logs out and same user logs back in', () => {
      fixture.detectChanges();

      // User logs in
      const userA = createMockUser({ uuid: 'user-a', emailVerified: false });
      userSubject.next(userA);

      // User dismisses the banner
      component.isDismissed = true;

      // User logs out
      userSubject.next(null);
      expect(component.isDismissed).toBeFalse(); // Reset on logout

      // Same user logs back in - should still show banner
      userSubject.next(userA);
      expect(component.isDismissed).toBeFalse();
    });

    it('should not reset isDismissed when same user data is re-emitted', () => {
      fixture.detectChanges();

      // User logs in
      const userA = createMockUser({ uuid: 'user-a', emailVerified: false });
      userSubject.next(userA);

      // User dismisses the banner
      component.isDismissed = true;

      // Same user data re-emitted (e.g., from refreshUser)
      const userARefreshed = createMockUser({ uuid: 'user-a', emailVerified: false });
      userSubject.next(userARefreshed);

      // Banner should stay dismissed for same user
      expect(component.isDismissed).toBeTrue();
    });
  });

  describe('shouldShow', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return false when no user', () => {
      component.user = null;
      expect(component.shouldShow).toBeFalse();
    });

    it('should return false when user is verified', () => {
      component.user = createMockUser({ emailVerified: true });
      expect(component.shouldShow).toBeFalse();
    });

    it('should return false when banner is dismissed', () => {
      component.user = createMockUser({ emailVerified: false });
      component.isDismissed = true;
      expect(component.shouldShow).toBeFalse();
    });

    it('should return true when user exists, not verified, and not dismissed', () => {
      component.user = createMockUser({ emailVerified: false });
      component.isDismissed = false;
      expect(component.shouldShow).toBeTrue();
    });
  });

  describe('dismiss', () => {
    it('should set isDismissed to true', () => {
      fixture.detectChanges();
      expect(component.isDismissed).toBeFalse();
      component.dismiss();
      expect(component.isDismissed).toBeTrue();
    });
  });

  describe('resendVerification', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call resendVerification service', fakeAsync(() => {
      userServiceSpy.resendVerification.and.returnValue(of({ message: 'Success' }));

      component.resendVerification();
      tick();

      expect(userServiceSpy.resendVerification).toHaveBeenCalled();
      expect(snackBarSpy.open).toHaveBeenCalledWith('Verification email sent!', 'Close', { duration: 3000 });
      expect(component.isResending).toBeFalse();
    }));

    it('should handle resend error', fakeAsync(() => {
      userServiceSpy.resendVerification.and.returnValue(
        throwError(() => ({ error: { error: 'Rate limited' } })),
      );

      component.resendVerification();
      tick();

      expect(snackBarSpy.open).toHaveBeenCalledWith('Rate limited', 'Close', { duration: 5000 });
      expect(component.isResending).toBeFalse();
    }));

    it('should handle error without specific message', fakeAsync(() => {
      userServiceSpy.resendVerification.and.returnValue(
        throwError(() => ({})),
      );

      component.resendVerification();
      tick();

      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Failed to send email. Please try again later.',
        'Close',
        { duration: 5000 },
      );
    }));
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from user changes', () => {
      fixture.detectChanges();
      const unsubscribeSpy = spyOn(component.userSubscription!, 'unsubscribe');
      component.ngOnDestroy();
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});
