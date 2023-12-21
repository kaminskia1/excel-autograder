import { Injectable } from '@angular/core';
import { Submission } from './submission';
import { Assignment } from '../assignment/assignment';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  cache: { [key: string]: Submission[] } = {};

  retrieve(assignment: Assignment): Submission[] {
    if (!this.cache[assignment.getUuid()]) this.cache[assignment.getUuid()] = [];
    return this.cache[assignment.getUuid()];
  }

  save(assignment: Assignment, submissions: Submission[]): void {
    this.cache[assignment.getUuid()] = submissions;
  }
}
