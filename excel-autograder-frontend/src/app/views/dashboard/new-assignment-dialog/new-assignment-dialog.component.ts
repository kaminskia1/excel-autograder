import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Assignment } from '../../../services/api/assignment/assignment';

@Component({
  selector: 'app-new-assignment-dialog',
  templateUrl: './new-assignment-dialog.component.html',
  styleUrls: ['./new-assignment-dialog.component.scss'],
})
export class NewAssignmentDialogComponent {
  newAssignment: Assignment = {
    name: '',
    file: '',
    encrypted: false,
  } as Assignment;

  constructor(
  public dialogRef: MatDialogRef<NewAssignmentDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: EventEmitter<Assignment|null>,
  ) {}
}
