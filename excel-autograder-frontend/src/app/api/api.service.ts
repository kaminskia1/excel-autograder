import { Injectable } from '@angular/core';
import { API_URL } from "../../main";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractApiService<T> {
  protected static headers: Headers = new Headers()
  private static apiUrl: string = "";

  protected constructor(public http: HttpClient) {
    AbstractApiService.apiUrl = API_URL
  }

  private _buildOptions(options: any): any {
    return {
      ...options,
      headers: options.hasOwnProperty('headers') ? {...AbstractApiService.headers, ...options.headers} : AbstractApiService.headers
    }
  }
  public registerHeader(key: string, value: string) {
    AbstractApiService.headers.set(key, value);
    console.log('', AbstractApiService.headers, value)
  }

  public deregisterHeader(key: string) {
    AbstractApiService.headers.delete(key);
  }

  protected get(path: string, options: object = {}): Observable<any> {
    return this.http.get(`${AbstractApiService.apiUrl}${path}`, this._buildOptions(options));
  }

  protected post(path: string, body: object = {}, options: object = {}): Observable<any> {
    return this.http.post(`${AbstractApiService.apiUrl}${path}`, body, this._buildOptions(options));
  }

  public list(): Observable<Array<T>> {
    throw new Error("Not implemented");
  }

  public create(instance: T): Observable<T> {
    throw new Error("Not implemented");
  }

  public retrieve(key: string): Observable<T> {
    throw new Error("Not implemented");
  }

  public update(instance: T): Observable<T> {
    throw new Error("Not implemented");
  }

  public destroy(instance: T): Observable<boolean> {
    throw new Error("Not implemented");
  }
}
