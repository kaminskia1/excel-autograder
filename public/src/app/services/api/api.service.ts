import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../main';

@Injectable({
  providedIn: 'root',
})
export abstract class ApiService {
  protected static headers: Headers = new Headers();

  private static apiUrl = '';

  protected constructor(public http: HttpClient) {
    ApiService.apiUrl = API_URL;
  }

  private static buildHttpOptions(options: NonNullable<unknown>): NonNullable<unknown> {
    return {
      ...options,
      headers: ('headers' in options && options.headers instanceof Object) ? { ...ApiService.headers, ...(options.headers) } : ApiService.headers,
    };
  }

  public static registerHeader(key: string, value: string) {
    ApiService.headers.set(key, value);
  }

  public static deregisterHeader(key: string) {
    ApiService.headers.delete(key);
  }

  public get(path: string, options: Partial<HttpHeaders> = {}): Observable<NonNullable<unknown>> {
    return this.http.get(`${ApiService.apiUrl}${path}`, ApiService.buildHttpOptions(options));
  }

  public post(
    path: string,
    body: NonNullable<unknown> = {},
    options: NonNullable<unknown> = {},
  ): Observable<NonNullable<unknown>> {
    return this.http.post(`${ApiService.apiUrl}${path}`, body, ApiService.buildHttpOptions(options));
  }

  public put(
    path: string,
    body: NonNullable<unknown> = {},
    options: NonNullable<unknown> = {},
  ): Observable<NonNullable<unknown>> {
    return this.http.put(`${ApiService.apiUrl}${path}`, body, ApiService.buildHttpOptions(options));
  }

  public delete(
    path: string,
    options: NonNullable<unknown> = {},
  ): Observable<NonNullable<unknown>> {
    return this.http.delete(`${ApiService.apiUrl}${path}`, ApiService.buildHttpOptions(options));
  }
}
