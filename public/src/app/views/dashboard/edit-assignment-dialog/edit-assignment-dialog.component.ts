import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Assignment } from '../../../models/assignment/assignment';
import { AssignmentFactory } from '../../../models/assignment/assignment.factory';
import { Question } from '../../../models/question/question';

interface EditAssignmentForm {
  name: FormControl<string>;
  file: FormControl<File | null>;
  encrypted: FormControl<boolean>;
  key: FormControl<string>;
  questions: FormControl<Question[]>;
}

@Component({
  selector: 'app-edit-assignment-dialog',
  templateUrl: './edit-assignment-dialog.component.html',
  styleUrls: ['./edit-assignment-dialog.component.scss'],
})
export class EditAssignmentDialogComponent {
  assignmentForm: FormGroup<EditAssignmentForm>;

  constructor(
    public dialogRef: MatDialogRef<EditAssignmentDialogComponent>,
    public assignmentFactory: AssignmentFactory,
    @Inject(MAT_DIALOG_DATA) public data: Assignment,
  ) {
    this.assignmentForm = new FormGroup<EditAssignmentForm>({
      name: new FormControl(data.name, { nonNullable: true, validators: [Validators.required] }),
      file: new FormControl<File | null>(null),
      encrypted: new FormControl(false, { nonNullable: true }),
      key: new FormControl('', { nonNullable: true }),
      questions: new FormControl<Question[]>([], { nonNullable: true }),
    });
    data.getFile();

    this.assignmentForm.controls.encrypted.valueChanges.subscribe((value) => {
      if (value) {
        this.assignmentForm.controls.key.setValidators([Validators.required]);
      } else {
        this.assignmentForm.controls.key.clearValidators();
      }
      this.assignmentForm.controls.key.updateValueAndValidity();
    });
  }

  update() {
    if (this.assignmentForm.invalid) return;

    const name = this.assignmentForm.controls.name.value;
    if (name) this.data.name = name;

    const file = this.assignmentForm.controls.file.value;
    if (file) this.data.setFile(file);

    const encrypted = this.assignmentForm.controls.encrypted.value;
    this.data.encrypted = encrypted;

    const key = this.assignmentForm.controls.key.value;
    if (key) this.data.setKey(key);
    this.data.save();
    this.dialogRef.close();
  }
}
