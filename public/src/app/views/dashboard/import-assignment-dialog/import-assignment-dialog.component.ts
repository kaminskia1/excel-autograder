import { Component, EventEmitter, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '../../../core/services';
import { AssignmentFactory } from '../../../models/assignment/assignment.factory';
import {
  Assignment,
  EncodedAssignment,
  IAssignment,
  IAssignmentPartial,
} from '../../../models/assignment/assignment';
import { QuestionFactory } from '../../../models/question/question.factory';
import { decodeBase64ToFile, decodeString } from '../../../utils/encoding.utils';

interface ImportAssignmentForm {
  data: FormControl<string>;
}

@Component({
  selector: 'app-import-assignment-dialog',
  templateUrl: './import-assignment-dialog.component.html',
  styleUrls: ['./import-assignment-dialog.component.scss'],
})
export class ImportAssignmentDialogComponent {
  importAssignmentForm: FormGroup<ImportAssignmentForm>;

  newAssignment: Assignment;

  constructor(
    public dialogRef: MatDialogRef<ImportAssignmentDialogComponent>,
    public assignmentFactory: AssignmentFactory,
    private notification: NotificationService,
    private questionFactory: QuestionFactory,
    @Inject(MAT_DIALOG_DATA) public data: EventEmitter<IAssignment|null>,
  ) {
    this.newAssignment = this.assignmentFactory.create({} as IAssignmentPartial);
    this.importAssignmentForm = new FormGroup<ImportAssignmentForm>({
      data: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    });
  }

  create() {
    if (this.importAssignmentForm.invalid) return;
    const data = this.importAssignmentForm.controls.data.value;
    if (!data) return;

    try {
      const ea: EncodedAssignment = JSON.parse(decodeString(data));
      if (!ea) throw new Error('Invalid data!');
      this.newAssignment.setFile(decodeBase64ToFile(ea.file, 'imported_assignment.xlsx'));
      this.newAssignment.name = ea.name;
      this.newAssignment.encrypted = false;
      this.newAssignment.questions = ea.questions.map(
        (q) => this.questionFactory.create(q),
      );
    } catch (e) {
      this.notification.error('Error parsing assignment data!');
      return;
    }
    this.data.emit(this.newAssignment);
    this.dialogRef.close();
  }
}
