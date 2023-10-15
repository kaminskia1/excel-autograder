import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api/api.service';
import { IUser, User } from './user';
import { UserFactory } from './user.factory';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ApiService {
  private currentUser = new BehaviorSubject<User|null>(null);

  constructor(
    public override http: HttpClient,
    private userFactory: UserFactory,

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
  }

  private deregisterUser(): void {
    localStorage.removeItem('user');
    ApiService.deregisterHeader('Authorization');
    this.currentUser.next(null);
  }

  public login(username: string, password: string): Observable<IUser> {
    const req = this.post('auth/login/', { username, password }) as Observable<IUser>;
    req.subscribe((user: IUser) => {
      this.registerUser(this.userFactory.createUser(user));
    });
    return req;
  }

  public logout(): void {
    this.post('auth/logout/').subscribe(() => {
      this.deregisterUser();
    });
  }

  public register(username: string, password: string): Observable<IUser> {
    const req = this.post('auth/register/', { username, password }) as Observable<IUser>;
    req.subscribe((user: IUser) => {
      this.registerUser(this.userFactory.createUser(user));
    });
    return req;
  }

  public isLoggedIn(): boolean {
    return this.currentUser.getValue() !== null;
  }

  getUser() {
    return this.currentUser.getValue();
  }
}
