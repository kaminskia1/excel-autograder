import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private static headers: Headers = new Headers();
  private static apiUrl = '';

  constructor(private http: HttpClient) {
    ApiService.apiUrl = API_URL;
  }

  private static buildHttpOptions(options: NonNullable<unknown>): NonNullable<unknown> {
    return {
      ...options,
      headers: ('headers' in options && options.headers instanceof Object) 
        ? { ...ApiService.headers, ...(options.headers) } 
        : ApiService.headers,
    };
  }

  public static registerHeader(key: string, value: string): void {
    ApiService.headers.set(key, value);
  }

  public static deregisterHeader(key: string): void {
    ApiService.headers.delete(key);
  }

  public get<T>(path: string, options: NonNullable<unknown> = {}): Observable<T> {
    return this.http.get<T>(`${ApiService.apiUrl}${path}`, ApiService.buildHttpOptions(options));
  }

  public post<T>(
    path: string,
    body: NonNullable<unknown> = {},
    options: NonNullable<unknown> = {},
  ): Observable<T> {
    return this.http.post<T>(`${ApiService.apiUrl}${path}`, body, ApiService.buildHttpOptions(options));
  }

  public put<T>(
    path: string,
    body: NonNullable<unknown> = {},
    options: NonNullable<unknown> = {},
  ): Observable<T> {
    return this.http.put<T>(`${ApiService.apiUrl}${path}`, body, ApiService.buildHttpOptions(options));
  }

  public delete<T>(
    path: string,
    options: NonNullable<unknown> = {},
  ): Observable<T> {
    return this.http.delete<T>(`${ApiService.apiUrl}${path}`, ApiService.buildHttpOptions(options));
  }
}
