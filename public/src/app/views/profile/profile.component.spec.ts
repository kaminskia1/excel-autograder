import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { UserService } from '../../models/user/user.service';
import { ApiService } from '../../services/api/api.service';
import { UserFactory } from '../../models/user/user.factory';
import { User } from '../../models/user/user';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const mockUser: User = new User({
    uuid: '123',
    username: 'testuser',
    email: 'test@example.com',
    emailVerified: false,
    pendingEmail: null,
    token: 'test-token',
    metadata: {},
  });

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj('UserService', [
      'getUser',
      'changeEmail',
      'resendVerification',
      'cancelEmailChange',
      'changePassword',
      'refreshUser',
    ]);
    const snackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    userSpy.getUser.and.returnValue(mockUser);
    userSpy.refreshUser.and.returnValue(of(mockUser));

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, MatSnackBarModule],
      declarations: [ProfileComponent],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: MatSnackBar, useValue: snackSpy },
        ApiService,
        UserFactory,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize email form with empty values', () => {
      expect(component.emailForm).toBeTruthy();
      expect(component.emailForm.get('newEmail')?.value).toBe('');
    });

    it('should initialize password form with empty values', () => {
      expect(component.passwordForm).toBeTruthy();
      expect(component.passwordForm.get('currentPassword')?.value).toBe('');
      expect(component.passwordForm.get('newPassword')?.value).toBe('');
      expect(component.passwordForm.get('confirmPassword')?.value).toBe('');
    });

    it('should initialize state flags to false', () => {
      expect(component.isChangingEmail).toBeFalse();
      expect(component.isResendingVerification).toBeFalse();
      expect(component.isCancellingEmailChange).toBeFalse();
      expect(component.isChangingPassword).toBeFalse();
    });
  });

  describe('Email Form Validation', () => {
    it('should mark email form invalid when empty', () => {
      component.emailForm.setValue({ newEmail: '' });
      expect(component.emailForm.valid).toBeFalse();
    });

    it('should mark email form invalid with invalid email', () => {
      component.emailForm.setValue({ newEmail: 'not-an-email' });
      expect(component.emailForm.valid).toBeFalse();
      expect(component.emailForm.get('newEmail')?.hasError('email')).toBeTrue();
    });

    it('should mark email form valid with valid email', () => {
      component.emailForm.setValue({ newEmail: 'valid@example.com' });
      expect(component.emailForm.valid).toBeTrue();
    });
  });

  describe('onChangeEmail', () => {
    it('should not call service if form is invalid', () => {
      component.emailForm.setValue({ newEmail: '' });
      component.onChangeEmail();
      expect(userServiceSpy.changeEmail).not.toHaveBeenCalled();
    });

    it('should call changeEmail service on valid form submission', fakeAsync(() => {
      const newEmail = 'newemail@example.com';
      userServiceSpy.changeEmail.and.returnValue(of({ message: 'Success' }));

      component.emailForm.setValue({ newEmail });
      component.onChangeEmail();
      tick();

      expect(userServiceSpy.changeEmail).toHaveBeenCalledWith(newEmail);
      expect(snackBarSpy.open).toHaveBeenCalled();
      expect(component.isChangingEmail).toBeFalse();
      expect(userServiceSpy.refreshUser).toHaveBeenCalled();
    }));

    it('should handle changeEmail error', fakeAsync(() => {
      userServiceSpy.changeEmail.and.returnValue(
        throwError(() => ({ error: { error: 'Email already in use' } }))
      );

      component.emailForm.setValue({ newEmail: 'taken@example.com' });
      component.onChangeEmail();
      tick();

      expect(snackBarSpy.open).toHaveBeenCalledWith('Email already in use', 'Close', { duration: 5000 });
      expect(component.isChangingEmail).toBeFalse();
    }));
  });

  describe('onResendVerification', () => {
    it('should call resendVerification service', fakeAsync(() => {
      userServiceSpy.resendVerification.and.returnValue(of({ message: 'Email sent' }));

      component.onResendVerification();
      tick();

      expect(userServiceSpy.resendVerification).toHaveBeenCalled();
      expect(snackBarSpy.open).toHaveBeenCalledWith('Verification email sent', 'Close', { duration: 3000 });
      expect(component.isResendingVerification).toBeFalse();
    }));

    it('should handle resendVerification error', fakeAsync(() => {
      userServiceSpy.resendVerification.and.returnValue(
        throwError(() => ({ error: { error: 'Rate limited' } }))
      );

      component.onResendVerification();
      tick();

      expect(snackBarSpy.open).toHaveBeenCalledWith('Rate limited', 'Close', { duration: 5000 });
      expect(component.isResendingVerification).toBeFalse();
    }));
  });

  describe('onCancelEmailChange', () => {
    it('should call cancelEmailChange service', fakeAsync(() => {
      userServiceSpy.cancelEmailChange.and.returnValue(of({ message: 'Cancelled' }));

      component.onCancelEmailChange();
      tick();

      expect(userServiceSpy.cancelEmailChange).toHaveBeenCalled();
      expect(snackBarSpy.open).toHaveBeenCalledWith('Email change cancelled', 'Close', { duration: 3000 });
      expect(component.isCancellingEmailChange).toBeFalse();
      expect(userServiceSpy.refreshUser).toHaveBeenCalled();
    }));

    it('should handle cancelEmailChange error', fakeAsync(() => {
      userServiceSpy.cancelEmailChange.and.returnValue(
        throwError(() => ({ error: { error: 'No pending change' } }))
      );

      component.onCancelEmailChange();
      tick();

      expect(snackBarSpy.open).toHaveBeenCalledWith('No pending change', 'Close', { duration: 5000 });
      expect(component.isCancellingEmailChange).toBeFalse();
    }));
  });

  describe('Password Form Validation', () => {
    it('should validate password match', () => {
      component.passwordForm.setValue({
        currentPassword: 'oldpass',
        newPassword: 'newpass123',
        confirmPassword: 'different',
      });

      expect(component.passwordForm.hasError('passwordMismatch')).toBeTrue();
      expect(component.passwordForm.get('confirmPassword')?.hasError('passwordMismatch')).toBeTrue();
    });

    it('should be valid when passwords match', () => {
      component.passwordForm.setValue({
        currentPassword: 'oldpass',
        newPassword: 'newpass123',
        confirmPassword: 'newpass123',
      });

      expect(component.passwordForm.hasError('passwordMismatch')).toBeFalse();
    });

    it('should clear passwordMismatch error when passwords become matching', () => {
      // First set mismatched passwords
      component.passwordForm.setValue({
        currentPassword: 'oldpass',
        newPassword: 'newpass123',
        confirmPassword: 'different',
      });
      
      expect(component.passwordForm.get('confirmPassword')?.hasError('passwordMismatch')).toBeTrue();
      
      // Now fix the password to match
      component.passwordForm.patchValue({ confirmPassword: 'newpass123' });
      
      // Error should be cleared
      expect(component.passwordForm.get('confirmPassword')?.hasError('passwordMismatch')).toBeFalse();
      expect(component.passwordForm.get('confirmPassword')?.errors).toBeNull();
    });

    it('should require minimum password length', () => {
      component.passwordForm.patchValue({ newPassword: 'short' });
      expect(component.passwordForm.get('newPassword')?.hasError('minlength')).toBeTrue();
    });
  });
});

