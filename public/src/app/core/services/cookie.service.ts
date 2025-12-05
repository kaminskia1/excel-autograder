import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  /**
   * Get a cookie value by name
   */
  get(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) continue;
      
      const cookieName = trimmed.substring(0, separatorIndex);
      const cookieValue = trimmed.substring(separatorIndex + 1);
      
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }

  /**
   * Set a cookie with optional expiration
   * @param name Cookie name
   * @param value Cookie value
   * @param days Days until expiration (default: 7 days, use 0 for session cookie)
   */
  set(name: string, value: string, days: number = 7): void {
    let expires = '';
    if (days > 0) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    // SameSite=Strict for security, Secure flag for HTTPS (commented out for local dev)
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Strict`;
  }

  /**
   * Delete a cookie by name
   */
  delete(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
  }

  /**
   * Check if a cookie exists
   */
  has(name: string): boolean {
    return this.get(name) !== null;
  }
}

