import { Observable, of } from 'rxjs';
import { IApiModel } from '../model';

export type ThemeMode = 'light' | 'dark';
export type ThemePreference = 'light' | 'dark' | 'system';

export interface UserMetadata {
  theme?: ThemePreference;
  [key: string]: unknown;
}

export interface UserCredentials {
  username: string|null
  password: string|null
}

export interface UserCredentialsNew extends UserCredentials {
  email: string|null
  confirmPassword: string|null
}

export interface UserCredentialsReset {
  username: string|null
}

export interface IUserPartial {
  uuid: string
  username: string
  email: string
  emailVerified?: boolean
  email_verified?: boolean
  pendingEmail?: string | null
  pending_email?: string | null
  token: string;
  metadata?: UserMetadata;
}

export interface IUser extends IUserPartial, IApiModel<IUserPartial> {

}

export class User implements IUser {
  uuid: string;

  username: string;

  email: string;

  emailVerified: boolean;

  pendingEmail: string | null;

  token: string;

  metadata: UserMetadata;

  constructor(user: IUserPartial) {
    this.uuid = user.uuid;
    this.username = user.username;
    this.email = user.email;
    // Handle both camelCase (frontend) and snake_case (backend API)
    this.emailVerified = user.emailVerified ?? user.email_verified ?? false;
    this.pendingEmail = user.pendingEmail ?? user.pending_email ?? null;
    this.token = user.token;
    this.metadata = user.metadata ?? {};
  }

  save(): Observable<User> {
    return of(this);
  }

  destroy(): Observable<boolean> {
    return of(false);
  }

  getSerializable(): IUserPartial {
    return {
      uuid: this.uuid,
      username: this.username,
      email: this.email,
      emailVerified: this.emailVerified,
      pendingEmail: this.pendingEmail,
      token: this.token,
      metadata: this.metadata,
    };
  }

  getThemePreference(): ThemePreference {
    return this.metadata.theme ?? 'system';
  }

  setThemePreference(pref: ThemePreference): void {
    this.metadata.theme = pref;
  }
}
