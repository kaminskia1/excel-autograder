import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import {
  IUser, User, UserCredentials, UserCredentialsNew, UserCredentialsReset,
} from './user';
import { UserFactory } from './user.factory';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor(
    private api: ApiService,
    private userFactory: UserFactory,
    private router: Router,
  ) {
    const user = localStorage.getItem('user');
    if (user) {
      // Restore user from localStorage without navigating (preserves current URL on refresh)
      this.registerUser(JSON.parse(user), false);
    }
  }

  private registerUser(user: User, navigate: boolean = true): void {
    localStorage.setItem('user', JSON.stringify(user));
    ApiService.registerHeader('Authorization', `Token ${user.token}`);
    this.currentUser.next(user);
    if (navigate) {
      this.router.navigate(['/']);
    }
  }

  private deregisterUser(): void {
    localStorage.removeItem('user');
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
