import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import {
  IUser, User, UserCredentials, UserCredentialsNew,
} from './user';
import { UserFactory } from './user.factory';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ApiService {
  private currentUser = new BehaviorSubject<User|null>(null);

  constructor(
    public override http: HttpClient,
    private userFactory: UserFactory,
    private router: Router,
  ) {
    super(http);
    const user = localStorage.getItem('user');
    if (user) {
      this.registerUser(JSON.parse(user));
    }
  }

  private registerUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    ApiService.registerHeader('Authorization', `Token ${user.token}`);
    this.currentUser.next(user);
    this.router.navigate(['/']);
  }

  private deregisterUser(): void {
    localStorage.removeItem('user');
    ApiService.deregisterHeader('Authorization');
    this.currentUser.next(null);
    this.router.navigate(['/login']);
  }

  public login(creds: UserCredentials): Observable<IUser> {
    const req = (this.post('auth/login/', creds) as Observable<IUser>).pipe(shareReplay(1));
    req.subscribe((user: IUser) => {
      this.registerUser(this.userFactory.createUser(user));
    });
    return req;
  }

  public register(creds: UserCredentialsNew): Observable<IUser> {
    const req = (this.post('auth/register/', creds) as Observable<IUser>).pipe(shareReplay(1));
    req.subscribe((user: IUser) => user);
    return req;
  }

  public logout(): void {
    this.post('auth/logout/').subscribe(() => {
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
