import { Injectable } from '@angular/core';
import { API_URL } from "../../../main";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractApiService<T> {
  protected static headers: Headers = new Headers()
  private static apiUrl = "";

  protected constructor(public http: HttpClient) {
    AbstractApiService.apiUrl = API_URL
  }

  private _buildOptions(options: NonNullable<Object>): NonNullable<Object> {
    return {
      ...options,
      headers: ('headers' in options && options.headers instanceof Object) ? {...AbstractApiService.headers, ...(options.headers)} : AbstractApiService.headers
    }
  }
  public registerHeader(key: string, value: string) {
    AbstractApiService.headers.set(key, value);
  }

  public deregisterHeader(key: string) {
    AbstractApiService.headers.delete(key);
  }

  protected get(path: string, options: Partial<HttpHeaders> = {}): Observable<NonNullable<Object>> {
    return this.http.get(`${AbstractApiService.apiUrl}${path}`, this._buildOptions(options));
  }

  protected post(path: string, body: NonNullable<Object> = {}, options: NonNullable<Object> = {}): Observable<NonNullable<Object>> {
    return this.http.post(`${AbstractApiService.apiUrl}${path}`, body, this._buildOptions(options));
  }

  public list(): Observable<Array<T>> {
    throw new Error("Not implemented");
  }

  public create(instance: T): Observable<T> {
    throw new Error("Not implemented" + instance);
  }

  public retrieve(key: string): Observable<T> {
    throw new Error("Not implemented" + key);
  }

  public update(instance: T): Observable<T> {
    throw new Error("Not implemented" + instance);
  }

  public destroy(instance: T): Observable<boolean> {
    throw new Error("Not implemented" + instance);
  }
}
