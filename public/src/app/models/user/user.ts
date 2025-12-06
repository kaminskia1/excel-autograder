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
  token: string
  metadata?: UserMetadata
}

export interface IUser extends IUserPartial, IApiModel<IUserPartial> {

}

export class User implements IUser {
  uuid: string;

  username: string;

  token: string;

  metadata: UserMetadata;

  constructor(user: IUserPartial) {
    this.uuid = user.uuid;
    this.username = user.username;
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
