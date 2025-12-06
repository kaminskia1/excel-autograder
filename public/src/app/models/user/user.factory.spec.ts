import { TestBed } from '@angular/core/testing';
import { UserFactory } from './user.factory';
import { User } from './user';

describe('UserFactory', () => {
  let factory: UserFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserFactory],
    });
    factory = TestBed.inject(UserFactory);
  });

  it('should be created', () => {
    expect(factory).toBeTruthy();
  });

  describe('createUser', () => {
    it('should return same User instance if already a User', () => {
      const existingUser = new User({
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        token: 'test-token',
      });

      const result = factory.createUser(existingUser);

      expect(result).toBe(existingUser);
    });

    it('should transform snake_case backend response to User', () => {
      const backendResponse = {
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        email_verified: true,
        pending_email: 'pending@example.com',
        token: 'test-token',
        metadata: { theme: 'dark' },
      };

      const user = factory.createUser(backendResponse);

      expect(user).toBeInstanceOf(User);
      expect(user.uuid).toBe('123');
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.emailVerified).toBeTrue();
      expect(user.pendingEmail).toBe('pending@example.com');
      expect(user.token).toBe('test-token');
    });

    it('should handle backend response with id instead of uuid', () => {
      const backendResponse = {
        id: 456,
        username: 'testuser',
        email: 'test@example.com',
        email_verified: false,
        token: 'test-token',
      };

      const user = factory.createUser(backendResponse as any);

      expect(user.uuid).toBe('456');
    });

    it('should handle camelCase frontend data', () => {
      const frontendData = {
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        emailVerified: true,
        pendingEmail: 'pending@example.com',
        token: 'test-token',
        metadata: {},
      };

      const user = factory.createUser(frontendData);

      expect(user.emailVerified).toBeTrue();
      expect(user.pendingEmail).toBe('pending@example.com');
    });

    it('should default email to empty string when not provided', () => {
      const backendResponse = {
        uuid: '123',
        username: 'testuser',
        token: 'test-token',
      };

      const user = factory.createUser(backendResponse as any);

      expect(user.email).toBe('');
    });

    it('should default emailVerified to false when not provided', () => {
      const backendResponse = {
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        token: 'test-token',
      };

      const user = factory.createUser(backendResponse);

      expect(user.emailVerified).toBeFalse();
    });

    it('should default pendingEmail to null when not provided', () => {
      const backendResponse = {
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        token: 'test-token',
      };

      const user = factory.createUser(backendResponse);

      expect(user.pendingEmail).toBeNull();
    });

    it('should prefer snake_case from backend over camelCase', () => {
      // This simulates a mixed response where backend snake_case should take precedence
      const mixedResponse = {
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        email_verified: true,
        emailVerified: false, // This should be ignored in favor of email_verified
        pending_email: 'backend@example.com',
        pendingEmail: 'frontend@example.com', // This should be ignored
        token: 'test-token',
      };

      const user = factory.createUser(mixedResponse as any);

      // Factory prefers snake_case from backend
      expect(user.emailVerified).toBeTrue();
      expect(user.pendingEmail).toBe('backend@example.com');
    });
  });
});

