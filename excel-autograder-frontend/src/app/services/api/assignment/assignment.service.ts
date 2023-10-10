import { Injectable } from '@angular/core';
import { AbstractApiService } from "../api.service";
import { Assignment } from "./assignment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AssignmentService extends AbstractApiService<Assignment> {

  constructor(override http: HttpClient) {
    super(http);
  }

  public override list(): Observable<Array<Assignment>> {
    return this.get('assignments/') as Observable<Array<Assignment>>;
  }

  public override create(instance: Assignment): Observable<Assignment> {
    throw new Error("Not implemented" + instance)
    //@TODO: Implement
  }

  public override retrieve(key: string): Observable<Assignment> {
    return this.get(`assignments/${key}/`) as Observable<Assignment>
  }

  public override update(instance: Assignment): Observable<Assignment> {
    throw new Error("Not implemented" + instance)
    //@TODO: Implement
  }

  public override destroy(instance: Assignment): Observable<boolean> {
    throw new Error("Not implemented" + instance)
    //@TODO: Implement
  }

  public getFile(assignment: Assignment): Observable<Blob> {
    return this.get(`files/` + assignment.file.split('/').pop(), { responseType: 'blob' } as Partial<HttpHeaders>) as Observable<Blob>;
  }
}
