import { Injectable } from '@angular/core';
import { IUserPartial, User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserFactory {
  createUser(user: IUserPartial): User {
    if (user instanceof User) return user;
    return new User(user);
  }
}
