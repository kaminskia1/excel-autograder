import { Buffer } from 'buffer';
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignmentFactory } from '../../../models/assignment/assignment.factory';
import {
  Assignment,
  EncodedAssignment,
  IAssignment,
  IAssignmentPartial,
} from '../../../models/assignment/assignment';
import { QuestionFactory } from '../../../models/question/question.factory';

@Component({
  selector: 'app-import-assignment-dialog',
  templateUrl: './import-assignment-dialog.component.html',
  styleUrls: ['./import-assignment-dialog.component.scss'],
})
export class ImportAssignmentDialogComponent {
  importAssignmentForm;

  newAssignment: Assignment;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ImportAssignmentDialogComponent>,
    public assignmentFactory: AssignmentFactory,
    private snackBar: MatSnackBar,
    private questionFactory: QuestionFactory,
    @Inject(MAT_DIALOG_DATA) public data: EventEmitter<IAssignment|null>,
  ) {
    this.newAssignment = this.assignmentFactory.createAssignment({} as IAssignmentPartial);
    this.importAssignmentForm = this.formBuilder.group({
      data: ['', Validators.required],
    });
  }

  create() {
    // @TODO: Clean this up (move to assignment or encode util?)
    const decodeBase64ToBlob = (base64String: string) => {
      const byteCharacters = atob(base64String.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i += 1) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new File([byteArray], 'imported_assignment.xlsx', { type: 'application/xlsx' });
    };

    if (this.importAssignmentForm.invalid) return;
    const { data } = this.importAssignmentForm.value;
    if (!data) return;
    let ea: EncodedAssignment | null = null;
    try {
      const decode = (str: string): string => Buffer.from(str, 'base64').toString('binary');
      ea = JSON.parse(decode(data));
      if (!ea) throw new Error('Invalid data!');
      this.newAssignment.setFile(decodeBase64ToBlob(ea.file));
      this.newAssignment.name = ea.name;
      this.newAssignment.encrypted = false;
      this.newAssignment.questions = ea.questions.map(
        (q) => this.questionFactory.createQuestion(q),
      );
    } catch (e) {
      this.snackBar.open('Error parsing assignment data!', 'Close', { duration: 1500 });
      return;
    }
    this.data.emit(this.newAssignment);
    this.dialogRef.close();
  }
}
