import { Injectable } from '@angular/core';
import { IUserPartial, User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserFactory {
  createUser(user: IUserPartial): User {
    if (user instanceof User) return user;

    return new User({
      uuid: user.uuid ?? '',
      username: user.username,
      email: user.email ?? '',
      emailVerified: user.emailVerified ?? false,
      pendingEmail: user.pendingEmail ?? null,
      token: user.token,
      metadata: user.metadata,
    });
  }
}
