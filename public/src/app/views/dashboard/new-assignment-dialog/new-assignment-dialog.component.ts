import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Assignment,
  IAssignment, IAssignmentPartial,
} from '../../../models/assignment/assignment';
import { AssignmentFactory } from '../../../models/assignment/assignment.factory';
import { Question } from '../../../models/question/question';

interface NewAssignmentForm {
  name: FormControl<string>;
  file: FormControl<File | null>;
  encrypted: FormControl<boolean>;
  key: FormControl<string>;
  questions: FormControl<Question[]>;
}

@Component({
  selector: 'app-new-assignment-dialog',
  templateUrl: './new-assignment-dialog.component.html',
  styleUrls: ['./new-assignment-dialog.component.scss'],
})
export class NewAssignmentDialogComponent {
  newAssignmentForm: FormGroup<NewAssignmentForm>;

  newAssignment: Assignment;

  constructor(
    public dialogRef: MatDialogRef<NewAssignmentDialogComponent>,
    public assignmentFactory: AssignmentFactory,
    @Inject(MAT_DIALOG_DATA) public data: EventEmitter<IAssignment|null>,
  ) {
    this.newAssignment = this.assignmentFactory.create({} as IAssignmentPartial);
    this.newAssignmentForm = new FormGroup<NewAssignmentForm>({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      file: new FormControl<File | null>(null, { validators: [Validators.required] }),
      encrypted: new FormControl(false, { nonNullable: true }),
      key: new FormControl('', { nonNullable: true }),
      questions: new FormControl<Question[]>([], { nonNullable: true }),
    });

    this.newAssignmentForm.controls.encrypted.valueChanges.subscribe((value) => {
      if (value) {
        this.newAssignmentForm.controls.key.setValidators([Validators.required]);
      } else {
        this.newAssignmentForm.controls.key.clearValidators();
      }
      this.newAssignmentForm.controls.key.updateValueAndValidity();
    });
  }

  create() {
    if (this.newAssignmentForm.invalid) return;

    const name = this.newAssignmentForm.controls.name.value;
    if (name) this.newAssignment.name = name;

    const file = this.newAssignmentForm.controls.file.value;
    if (file) this.newAssignment.setFile(file);

    const encrypted = this.newAssignmentForm.controls.encrypted.value;
    this.newAssignment.encrypted = encrypted;

    const key = this.newAssignmentForm.controls.key.value;
    if (key) this.newAssignment.setKey(key);

    // Create a default problem
    this.newAssignment.addQuestion();

    this.data.emit(this.newAssignment);
    this.dialogRef.close();
  }
}
