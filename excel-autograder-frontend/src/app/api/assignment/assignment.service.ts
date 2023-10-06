import { Injectable } from '@angular/core';
import { AbstractApiService } from "../api.service";
import { Assignment } from "./assignment";
import { HttpClient } from "@angular/common/http";
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

  //@ts-ignore
  public override create(instance: Assignment): Observable<Assignment> {
  }

  public override retrieve(key: string): Observable<Assignment> {
    return this.get(`assignments/${key}/`) as Observable<Assignment>
  }

  //@ts-ignore
  public override update(instance: Assignment): Observable<Assignment> {}

  //@ts-ignore
  public override destroy(instance: Assignment): Observable<boolean> {}
}
