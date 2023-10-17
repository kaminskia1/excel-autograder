import { Injectable } from '@angular/core';
import { QuestionFactory } from '../question/question.factory';
import { AssignmentService } from './assignment.service';
import { Assignment, IAssignmentPartial } from './assignment';

@Injectable({
  providedIn: 'root',
})
export class AssignmentFactory {
  constructor(
    private questionFactory: QuestionFactory,
    private assignmentService: AssignmentService,
  ) { }

  createAssignment(assignment: IAssignmentPartial): Assignment {
    if (assignment instanceof Assignment) return assignment;
    return new Assignment(assignment, this.questionFactory, this, this.assignmentService);
  }
}
