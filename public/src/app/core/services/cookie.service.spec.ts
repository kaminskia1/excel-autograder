import { TestBed } from '@angular/core/testing';
import { CookieService } from './cookie.service';

describe('CookieService', () => {
  let service: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CookieService],
    });
    service = TestBed.inject(CookieService);
  });

  afterEach(() => {
    // Clean up any test cookies
    service.delete('test_cookie');
    service.delete('another_cookie');
  });

  describe('set and get', () => {
    it('should set and get a cookie value', () => {
      service.set('test_cookie', 'test_value');
      expect(service.get('test_cookie')).toBe('test_value');
    });

    it('should return null for non-existent cookie', () => {
      expect(service.get('nonexistent_cookie')).toBeNull();
    });

    it('should handle special characters in cookie value', () => {
      service.set('test_cookie', 'value with spaces & symbols=!');
      expect(service.get('test_cookie')).toBe('value with spaces & symbols=!');
    });

    it('should handle cookie values containing equals signs', () => {
      // Auth tokens often contain = characters
      const tokenWithEquals = 'abc123=def456==xyz789';
      service.set('test_cookie', tokenWithEquals);
      expect(service.get('test_cookie')).toBe(tokenWithEquals);
    });

    it('should overwrite existing cookie', () => {
      service.set('test_cookie', 'first_value');
      service.set('test_cookie', 'second_value');
      expect(service.get('test_cookie')).toBe('second_value');
    });
  });

  describe('delete', () => {
    it('should delete an existing cookie', () => {
      service.set('test_cookie', 'test_value');
      expect(service.get('test_cookie')).toBe('test_value');

      service.delete('test_cookie');
      expect(service.get('test_cookie')).toBeNull();
    });

    it('should not throw when deleting non-existent cookie', () => {
      expect(() => service.delete('nonexistent_cookie')).not.toThrow();
    });
  });

  describe('has', () => {
    it('should return true for existing cookie', () => {
      service.set('test_cookie', 'test_value');
      expect(service.has('test_cookie')).toBeTrue();
    });

    it('should return false for non-existent cookie', () => {
      expect(service.has('nonexistent_cookie')).toBeFalse();
    });

    it('should return false after cookie is deleted', () => {
      service.set('test_cookie', 'test_value');
      service.delete('test_cookie');
      expect(service.has('test_cookie')).toBeFalse();
    });
  });

  describe('multiple cookies', () => {
    it('should handle multiple cookies independently', () => {
      service.set('test_cookie', 'value1');
      service.set('another_cookie', 'value2');

      expect(service.get('test_cookie')).toBe('value1');
      expect(service.get('another_cookie')).toBe('value2');

      service.delete('test_cookie');

      expect(service.get('test_cookie')).toBeNull();
      expect(service.get('another_cookie')).toBe('value2');
    });
  });
});

