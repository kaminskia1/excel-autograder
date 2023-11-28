import { Observable } from 'rxjs';

export interface IModel<M> {
  getSerializable(): M
}

export interface IApiModel<M> extends IModel<M> {
  save(): Observable<M>;
  destroy(): Observable<boolean>;
}
