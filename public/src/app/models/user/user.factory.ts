import { Injectable } from '@angular/core';
import { IUserPartial, User } from './user';

// Backend response type (snake_case)
interface IUserResponse {
  uuid?: string;
  id?: number;
  username: string;
  email?: string;
  email_verified?: boolean;
  pending_email?: string | null;
  token: string;
  metadata?: Record<string, unknown>;
}

@Injectable({
  providedIn: 'root',
})
export class UserFactory {
  createUser(user: IUserPartial | IUserResponse): User {
    if (user instanceof User) return user;
    
    // Transform snake_case backend response to camelCase frontend model
    const transformed: IUserPartial = {
      uuid: (user as IUserResponse).uuid ?? String((user as IUserResponse).id ?? ''),
      username: user.username,
      email: (user as IUserResponse).email ?? '',
      emailVerified: (user as IUserResponse).email_verified ?? (user as IUserPartial).emailVerified ?? false,
      pendingEmail: (user as IUserResponse).pending_email ?? (user as IUserPartial).pendingEmail ?? null,
      token: user.token,
      metadata: user.metadata,
    };
    
    return new User(transformed);
  }
}
