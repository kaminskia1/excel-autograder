import { Observable, of } from 'rxjs';
import { IApiModel } from '../model';

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
}

export interface IUser extends IUserPartial, IApiModel<IUserPartial> {

}

export class User implements IUser {
  uuid: string;

  username: string;

  token: string;

  constructor(user: IUserPartial) {
    this.uuid = user.uuid;
    this.username = user.username;
    this.token = user.token;
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
    };
  }
}
