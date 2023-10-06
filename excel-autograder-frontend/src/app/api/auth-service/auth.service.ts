import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AbstractApiService } from "../api.service";
import { User } from "./auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends AbstractApiService<User> {
  private currentUser = new BehaviorSubject<User|null>(null);

   constructor(public override http: HttpClient) {
    super(http);
    let user = localStorage.getItem('user');
    if (user) {
      this._registerUser(JSON.parse(user))
    }
  }

  private _registerUser(user: User): void {
     localStorage.setItem('user', JSON.stringify(user));
     this.registerHeader('Authorization', `Token ${user.token}`)
     this.currentUser.next(user);
  }

  private _deregisterUser(): void {
    localStorage.removeItem('user');
    this.deregisterHeader('Authorization')
    this.currentUser.next(null);
  }

  public login(username: string, password: string): Observable<User> {
     let req = this.post('auth/login/', {username, password}) as Observable<User>
    req.subscribe({
      next: (user: User) => {
        this._registerUser(user)
      }
    });
    return req;
  }

  public logout(): Observable<any> {
    let user = this.currentUser.getValue();
    // check that u is a user object
    if (user === null) return of(false)
    let req = this.post('auth/logout/') as Observable<any>
    req.subscribe({
      next: () => {
        this._deregisterUser()
      }
    })
    return req
  }

  public register(username: string, password: string): Observable<User> {
    let req = this.post('auth/register/', {username, password}) as Observable<User>
    req.subscribe({
      next: (user: User) => {
        this._registerUser(user)
      }
    })
    return req
  }

  public isLoggedIn(): boolean {
    return this.currentUser.getValue() !== null;
  }

  getUser() {
    return this.currentUser.getValue()
  }
}
