import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, of, first, map } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import {
  IUser, User, UserCredentials, UserCredentialsNew, UserCredentialsReset,
} from './user';
import { UserFactory } from './user.factory';
import { CookieService, ThemeService } from '../../core/services';

// Cookie name for storing auth token
const AUTH_TOKEN_COOKIE = 'auth_token';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser = new BehaviorSubject<User | null>(null);

  // Track whether initial session restoration has completed
  private sessionRestored = new BehaviorSubject<boolean>(false);

  constructor(
    private api: ApiService,
    private userFactory: UserFactory,
    private router: Router,
    private cookieService: CookieService,
    private themeService: ThemeService,
  ) {
    const token = this.cookieService.get(AUTH_TOKEN_COOKIE);
    if (token) {
      // Restore user from cookie without navigating (preserves current URL on refresh)
      // We need to fetch user info from API since we only store the token
      this.restoreSession(token);
    } else {
      // No token, session restoration is "complete"
      this.sessionRestored.next(true);
    }
  }

  private restoreSession(token: string): void {
    // Set the token immediately so API calls work
    ApiService.registerHeader('Authorization', `Token ${token}`);
    
    // Fetch user info from API
    this.api.get<IUser>('auth/me/').subscribe({
      next: (userData) => {
        const user = this.userFactory.createUser({ ...userData, token });
        this.currentUser.next(user);
        // Initialize theme from user metadata
        this.themeService.initializeFromMetadata(user.metadata);
        this.sessionRestored.next(true);
      },
      error: () => {
        // Token is invalid, clear it
        this.cookieService.delete(AUTH_TOKEN_COOKIE);
        ApiService.deregisterHeader('Authorization');
        this.sessionRestored.next(true);
      },
    });
  }

  /**
   * Observable that emits once the initial session restoration is complete.
   * Use this in route guards to wait for auth state to be determined.
   */
  waitForSessionRestore(): Observable<boolean> {
    return this.sessionRestored.pipe(
      first((restored) => restored),
      map(() => this.isLoggedIn()),
    );
  }

  private registerUser(user: User, navigate: boolean = true): void {
    this.cookieService.set(AUTH_TOKEN_COOKIE, user.token, 7); // 7 days
    ApiService.registerHeader('Authorization', `Token ${user.token}`);
    this.currentUser.next(user);
    // Initialize theme from user metadata
    this.themeService.initializeFromMetadata(user.metadata);
    if (navigate) {
      this.router.navigate(['/']);
    }
  }

  private deregisterUser(): void {
    this.cookieService.delete(AUTH_TOKEN_COOKIE);
    ApiService.deregisterHeader('Authorization');
    this.currentUser.next(null);
    this.router.navigate(['/login']);
  }

  public login(creds: UserCredentials): Observable<IUser> {
    const req = this.api.post<IUser>('auth/login/', creds).pipe(shareReplay(1));
    req.subscribe((user: IUser) => {
      this.registerUser(this.userFactory.createUser(user));
    });
    return req;
  }

  public register(creds: UserCredentialsNew): Observable<IUser> {
    const req = this.api.post<IUser>('auth/register/', creds).pipe(shareReplay(1));
    req.subscribe((user: IUser) => user);
    return req;
  }

  public reset(creds: UserCredentialsReset): Observable<boolean> {
    const req = this.api.post<boolean>('auth/reset/', creds).pipe(shareReplay(1));
    req.subscribe((success: boolean) => success);
    return req;
  }

  public logout(): void {
    this.api.post<void>('auth/logout/').subscribe(() => {
      this.deregisterUser();
    });
  }

  public isLoggedIn(): boolean {
    return this.currentUser.getValue() !== null;
  }

  getUser() {
    return this.currentUser.getValue();
  }
}
