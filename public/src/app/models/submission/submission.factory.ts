import { Injectable } from '@angular/core';
import { ISubmissionPartial, Submission } from './submission';

@Injectable({
  providedIn: 'root',
})
export class SubmissionFactory {
  create(submission: ISubmissionPartial): Submission {
    if (submission instanceof Submission) return submission;
    return new Submission(submission);
  }
}
