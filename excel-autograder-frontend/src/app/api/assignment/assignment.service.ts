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
    return this.http.get('http://127.0.0.1:8000/api/v1/questions/') as Observable<Array<Assignment>>;
  }
}
