import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api/api.service';
import { IAssignment } from './assignment';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  constructor(private api: ApiService) {}

  /**
   * List all assignments. Does not auto-resolve
   * @returns Observable<Array<IAssignment>>
   */
  public list(): Observable<Array<IAssignment>> {
    return this.api.get<Array<IAssignment>>('assignments/');
  }

  /**
   * Retrieve an assignment by its key. Does not auto-resolve
   * @param key
   * @returns Observable<IAssignment>
   */
  public retrieve(key: string): Observable<IAssignment> {
    return this.api.get<IAssignment>(`assignments/${key}/`);
  }

  // Pass-through methods for Assignment model compatibility
  public get<T>(path: string, options: NonNullable<unknown> = {}): Observable<T> {
    return this.api.get<T>(path, options);
  }

  public post<T>(path: string, body: NonNullable<unknown> = {}, options: NonNullable<unknown> = {}): Observable<T> {
    return this.api.post<T>(path, body, options);
  }

  public put<T>(path: string, body: NonNullable<unknown> = {}, options: NonNullable<unknown> = {}): Observable<T> {
    return this.api.put<T>(path, body, options);
  }

  public delete<T>(path: string, options: NonNullable<unknown> = {}): Observable<T> {
    return this.api.delete<T>(path, options);
  }
}
