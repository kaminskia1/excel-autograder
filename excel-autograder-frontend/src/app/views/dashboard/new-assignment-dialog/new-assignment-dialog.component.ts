import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Assignment,
  IAssignment,
  IAssignmentPartial,
} from '../../../models/assignment/assignment';
import { AssignmentFactory } from '../../../models/assignment/assignment.factory';

@Component({
  selector: 'app-new-assignment-dialog',
  templateUrl: './new-assignment-dialog.component.html',
  styleUrls: ['./new-assignment-dialog.component.scss'],
})
export class NewAssignmentDialogComponent {
  newAssignment: Assignment;

  constructor(
    public dialogRef: MatDialogRef<NewAssignmentDialogComponent>,
    public assignmentFactory: AssignmentFactory,
    @Inject(MAT_DIALOG_DATA) public data: EventEmitter<IAssignment|null>,
  ) {
    this.newAssignment = this.assignmentFactory.createAssignment({
      name: '',
      file: '',
      encrypted: false,
      questions: [],
    } as unknown as IAssignmentPartial);
  }

  create() {
    this.data.emit(this.assignmentFactory.createAssignment(this.newAssignment));
    this.dialogRef.close();
  }
}
