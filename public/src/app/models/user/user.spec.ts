import { User, IUserPartial } from './user';

describe('User', () => {
  describe('constructor', () => {
    it('should create user with all fields', () => {
      const userData: IUserPartial = {
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        emailVerified: true,
        pendingEmail: 'pending@example.com',
        token: 'test-token',
        metadata: { theme: 'dark' },
      };

      const user = new User(userData);

      expect(user.uuid).toBe('123');
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.emailVerified).toBeTrue();
      expect(user.pendingEmail).toBe('pending@example.com');
      expect(user.token).toBe('test-token');
      expect(user.metadata.theme).toBe('dark');
    });

    it('should handle snake_case email_verified field from backend', () => {
      const userData: IUserPartial = {
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        email_verified: true,
        token: 'test-token',
      };

      const user = new User(userData);

      expect(user.emailVerified).toBeTrue();
    });

    it('should handle snake_case pending_email field from backend', () => {
      const userData: IUserPartial = {
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        pending_email: 'new@example.com',
        token: 'test-token',
      };

      const user = new User(userData);

      expect(user.pendingEmail).toBe('new@example.com');
    });

    it('should default emailVerified to false when not provided', () => {
      const userData: IUserPartial = {
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        token: 'test-token',
      };

      const user = new User(userData);

      expect(user.emailVerified).toBeFalse();
    });

    it('should default pendingEmail to null when not provided', () => {
      const userData: IUserPartial = {
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        token: 'test-token',
      };

      const user = new User(userData);

      expect(user.pendingEmail).toBeNull();
    });

    it('should default metadata to empty object when not provided', () => {
      const userData: IUserPartial = {
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        token: 'test-token',
      };

      const user = new User(userData);

      expect(user.metadata).toEqual({});
    });

    it('should prefer camelCase over snake_case when both provided', () => {
      const userData: IUserPartial = {
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        emailVerified: true,
        email_verified: false,
        pendingEmail: 'camel@example.com',
        pending_email: 'snake@example.com',
        token: 'test-token',
      };

      const user = new User(userData);

      expect(user.emailVerified).toBeTrue();
      expect(user.pendingEmail).toBe('camel@example.com');
    });
  });

  describe('getSerializable', () => {
    it('should return serializable user data', () => {
      const userData: IUserPartial = {
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        emailVerified: true,
        pendingEmail: 'pending@example.com',
        token: 'test-token',
        metadata: { theme: 'light' },
      };

      const user = new User(userData);
      const serializable = user.getSerializable();

      expect(serializable.uuid).toBe('123');
      expect(serializable.username).toBe('testuser');
      expect(serializable.email).toBe('test@example.com');
      expect(serializable.emailVerified).toBeTrue();
      expect(serializable.pendingEmail).toBe('pending@example.com');
      expect(serializable.token).toBe('test-token');
      expect(serializable.metadata).toEqual({ theme: 'light' });
    });
  });

  describe('getThemePreference', () => {
    it('should return theme from metadata', () => {
      const user = new User({
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        token: 'test-token',
        metadata: { theme: 'dark' },
      });

      expect(user.getThemePreference()).toBe('dark');
    });

    it('should return system as default when no theme set', () => {
      const user = new User({
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        token: 'test-token',
        metadata: {},
      });

      expect(user.getThemePreference()).toBe('system');
    });
  });

  describe('setThemePreference', () => {
    it('should set theme in metadata', () => {
      const user = new User({
        uuid: '123',
        username: 'testuser',
        email: 'test@example.com',
        token: 'test-token',
        metadata: {},
      });

      user.setThemePreference('dark');

      expect(user.metadata.theme).toBe('dark');
      expect(user.getThemePreference()).toBe('dark');
    });
  });
});

