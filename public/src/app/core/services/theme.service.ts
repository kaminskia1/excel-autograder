import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../services/api/api.service';
import { ThemeMode, ThemePreference, UserMetadata } from '../../models/user/user';

const THEME_STORAGE_KEY = 'app_theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<ThemeMode>('light');
  private themePreference = new BehaviorSubject<ThemePreference>('system');
  private systemDarkMode = false;
  
  theme$ = this.currentTheme.asObservable();
  preference$ = this.themePreference.asObservable();

  constructor(private api: ApiService) {
    // Detect system preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemDarkMode = mediaQuery.matches;
      
      // Listen for system changes
      mediaQuery.addEventListener('change', (e) => {
        this.systemDarkMode = e.matches;
        if (this.themePreference.getValue() === 'system') {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
    
    // Initialize from localStorage
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      this.setPreference(stored, false);
    } else {
      // Default to system preference
      this.setPreference('system', false);
    }
  }

  /**
   * Get the current effective theme (light or dark)
   */
  getTheme(): ThemeMode {
    return this.currentTheme.getValue();
  }

  /**
   * Get the user's theme preference (light, dark, or system)
   */
  getPreference(): ThemePreference {
    return this.themePreference.getValue();
  }

  /**
   * Set theme from user metadata (called on login/session restore)
   */
  initializeFromMetadata(metadata: UserMetadata | undefined): void {
    const pref = metadata?.theme ?? 'system';
    this.setPreference(pref, false);
  }

  /**
   * Set the theme preference and optionally persist to backend
   */
  setPreference(pref: ThemePreference, persistToBackend: boolean = true): void {
    this.themePreference.next(pref);
    
    // Resolve effective theme
    const effectiveTheme: ThemeMode = 
      pref === 'system' 
        ? (this.systemDarkMode ? 'dark' : 'light')
        : pref;
    
    this.applyTheme(effectiveTheme);
    
    // Store in localStorage
    localStorage.setItem(THEME_STORAGE_KEY, pref);
    
    // Persist to backend if requested
    if (persistToBackend) {
      this.persistThemeToBackend(pref);
    }
  }

  /**
   * Toggle between light and dark themes (ignores system)
   */
  toggleTheme(): void {
    const current = this.currentTheme.getValue();
    const newPref: ThemePreference = current === 'light' ? 'dark' : 'light';
    this.setPreference(newPref);
  }

  /**
   * Apply theme to DOM
   */
  private applyTheme(theme: ThemeMode): void {
    this.currentTheme.next(theme);
    
    // Remove FOUC prevention class from html element (added by index.html script)
    document.documentElement.classList.remove('dark-theme-pending');
    
    // Apply to document body
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
    
    // Update color-scheme for native elements
    document.documentElement.style.colorScheme = theme;
  }

  /**
   * Persist theme preference to backend
   */
  private persistThemeToBackend(pref: ThemePreference): void {
    this.api.post<{ metadata: UserMetadata }>('auth/me/', {
      metadata: { theme: pref },
    }).subscribe({
      error: (err) => console.error('Failed to save theme preference:', err),
    });
  }

  /**
   * Check if dark mode is currently active
   */
  isDarkMode(): boolean {
    return this.currentTheme.getValue() === 'dark';
  }

  /**
   * Check if system preference is being used
   */
  isSystemPreference(): boolean {
    return this.themePreference.getValue() === 'system';
  }
}
