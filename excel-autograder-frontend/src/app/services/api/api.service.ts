import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../main';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractApiService<T> {
  protected static headers: Headers = new Headers();

  private static apiUrl = '';

  protected constructor(public http: HttpClient) {
    AbstractApiService.apiUrl = API_URL;
  }

  private _buildOptions(options: NonNullable<unknown>): NonNullable<unknown> {
    return {
      ...options,
      headers: ('headers' in options && options.headers instanceof Object) ? { ...AbstractApiService.headers, ...(options.headers) } : AbstractApiService.headers,
    };
  }

  public registerHeader(key: string, value: string) {
    AbstractApiService.headers.set(key, value);
  }

  public deregisterHeader(key: string) {
    AbstractApiService.headers.delete(key);
  }

  protected get(path: string, options: Partial<HttpHeaders> = {}): Observable<NonNullable<unknown>> {
    return this.http.get(`${AbstractApiService.apiUrl}${path}`, this._buildOptions(options));
  }

  protected post(path: string, body: NonNullable<unknown> = {}, options: NonNullable<unknown> = {}): Observable<NonNullable<unknown>> {
    return this.http.post(`${AbstractApiService.apiUrl}${path}`, body, this._buildOptions(options));
  }

  protected put(path: string, body: NonNullable<unknown> = {}, options: NonNullable<unknown> = {}): Observable<NonNullable<unknown>> {
    return this.http.put(`${AbstractApiService.apiUrl}${path}`, body, this._buildOptions(options));
  }

  protected delete(path: string, options: NonNullable<unknown> = {}): Observable<NonNullable<unknown>> {
    return this.http.delete(`${AbstractApiService.apiUrl}${path}`, this._buildOptions(options));
  }

  public list(): Observable<Array<T>> {
    throw new Error('Not implemented');
  }

  public create(instance: T): Observable<T> {
    throw new Error(`Not implemented${instance}`);
  }

  public retrieve(key: string): Observable<T> {
    throw new Error(`Not implemented${key}`);
  }

  public update(instance: T): Observable<T> {
    throw new Error(`Not implemented${instance}`);
  }

  public destroy(instance: T): Observable<boolean> {
    throw new Error(`Not implemented${instance}`);
  }
}
