import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api/api.service';
import { IAssignment } from './assignment';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService extends ApiService {
  constructor(override http: HttpClient) {
    super(http);
  }

  /**
   * List all assignments. Does not auto-resolve
   * @returns Observable<Array<IAssignment>>
   */
  public list(): Observable<Array<IAssignment>> {
    // @TODO: restructure this into a promise to return Assignment[]
    return this.get('assignments/') as Observable<Array<IAssignment>>;
  }

  /**
   * Retrieve an assignment by its key. Does not auto-resolve
   * @param key
   * @returns Observable<IAssignment>
   */
  public retrieve(key: string): Observable<IAssignment> {
    return this.get(`assignments/${key}/`) as Observable<IAssignment>;
  }
}
