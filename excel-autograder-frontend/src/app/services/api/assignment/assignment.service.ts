import { Injectable } from '@angular/core';
import { AbstractApiService } from "../api.service";
import { Assignment } from "./assignment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of, pipe, shareReplay} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AssignmentService extends AbstractApiService<Assignment> {

  specialTypes: Array<String> = ['file', 'questions']

  constructor(override http: HttpClient) {
    super(http);
  }

  /**
   * List all assignments. Does not auto-resolve
   * @returns Observable<Array<Assignment>>
   */
  public override list(): Observable<Array<Assignment>> {
    return this.get('assignments/') as Observable<Array<Assignment>>;
  }

  /**
   * Create an assignment. Auto-resolves
   * @param instance
   * @returns Observable<Assignment>
   */
  public override create(instance: Assignment): Observable<Assignment> {
    const form: FormData = new FormData();
    if (instance._file) form.append('file', instance._file, instance._file.name)
    if (instance.questions) {
      instance.questions.forEach((question) => {
        if (question._targetCell) {
          question.targetCell = question._targetCell.fullAddress
        }
        delete question._targetCell
      })
      form.append('questions', JSON.stringify(instance.questions))
    }
    Object.entries(instance).forEach(([key, value]) => { if (!(key in this.specialTypes) && !(key.charAt(0) == "_")) form.append(key, value) })
    const obs: Observable<Assignment> = (this.post('assignments/', form) as Observable<Assignment>).pipe(shareReplay(1))
    obs.subscribe(() => {})
    return obs
  }

  /**
   * Retrieve an assignment by its key. Does not auto-resolve
   * @param key
   * @returns Observable<Assignment>
   */
  public override retrieve(key: string): Observable<Assignment> {
    return this.get(`assignments/${key}/`) as Observable<Assignment>
  }

  /**
   * Update an assignment. Auto-resolves
   * @param instance
   */
  public override update(instance: Assignment): Observable<Assignment> {
    const form: FormData = new FormData();
    if (instance._file) form.append('file', instance._file, instance.file.split('/').pop());
    if (instance.questions) {
      instance.questions.forEach((question) => {
        if (question._targetCell) {
          question.targetCell = question._targetCell.fullAddress
        }
        delete question._targetCell
      })
      form.append('questions', JSON.stringify(instance.questions))
    }
    Object.entries(instance).forEach(([key, value]) => { if (!this.specialTypes.includes(key)) form.append(key, value) })
    const obs = (this.put(`assignments/${instance.uuid}/`, form) as Observable<Assignment>).pipe(shareReplay(1))
    obs.subscribe(() => {})
    return obs
  }

  /**
   * Delete an assignment. Auto-resolves
   * @param instance
   */
  public override destroy(instance: Assignment): Observable<boolean> {
    const obs = (this.delete(`assignments/${instance.uuid}/`, instance) as Observable<boolean>).pipe(shareReplay(1))
    obs.subscribe(() => {})
    return obs
  }

  /**
   * Returns the file associated with an assignment. Auto-resolves to enable caching
   * @param assignment
   * @returns Observable<Blob>
   */
  public getFile(assignment: Assignment): Observable<Blob> {
    if (assignment._file) return of(assignment._file)
    const obs = (this.get(`files/` + assignment.file.split('/').pop(), {responseType: 'blob'} as Partial<HttpHeaders>) as Observable<Blob>).pipe(shareReplay(1))
    obs.subscribe((file) => { assignment._file = file });
    return obs;
  }
}
