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

    it('should create User from user data', () => {
      const userData = {
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        emailVerified: true,
        pendingEmail: 'pending@example.com',
        token: 'test-token',
        metadata: { theme: 'dark' as const },
      };

      const user = factory.createUser(userData);

      expect(user).toBeInstanceOf(User);
      expect(user.uuid).toBe('123');
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.emailVerified).toBeTrue();
      expect(user.pendingEmail).toBe('pending@example.com');
      expect(user.token).toBe('test-token');
    });

    it('should default email to empty string when not provided', () => {
      const userData = {
        uuid: '123',
        username: 'testuser',
        token: 'test-token',
      };

      const user = factory.createUser(userData as any);

      expect(user.email).toBe('');
    });

    it('should default emailVerified to false when not provided', () => {
      const userData = {
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        token: 'test-token',
      };

      const user = factory.createUser(userData);

      expect(user.emailVerified).toBeFalse();
    });

    it('should default pendingEmail to null when not provided', () => {
      const userData = {
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        token: 'test-token',
      };

      const user = factory.createUser(userData);

      expect(user.pendingEmail).toBeNull();
    });

    it('should default uuid to empty string when not provided', () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        token: 'test-token',
      };

      const user = factory.createUser(userData as any);

      expect(user.uuid).toBe('');
    });
  });
});
