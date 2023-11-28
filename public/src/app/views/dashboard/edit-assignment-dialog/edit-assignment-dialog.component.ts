import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Assignment } from '../../../models/assignment/assignment';
import { AssignmentFactory } from '../../../models/assignment/assignment.factory';

@Component({
  selector: 'app-edit-assignment-dialog',
  templateUrl: './edit-assignment-dialog.component.html',
  styleUrls: ['./edit-assignment-dialog.component.scss'],
})
export class EditAssignmentDialogComponent {
  assignmentForm;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditAssignmentDialogComponent>,
    public assignmentFactory: AssignmentFactory,
    @Inject(MAT_DIALOG_DATA) public data: Assignment,
  ) {
    this.assignmentForm = this.formBuilder.group({
      name: [data.name, Validators.required],
      file: [null],
      encrypted: [false],
      key: [''],
      questions: [[]],
    });
    data.getFile();

    this.assignmentForm.get('encrypted')?.valueChanges.subscribe((value) => {
      if (value) {
        this.assignmentForm.get('key')?.setValidators([Validators.required]);
      } else {
        this.assignmentForm.get('key')?.clearValidators();
      }
      this.assignmentForm.get('key')?.updateValueAndValidity();
    });
  }

  update() {
    if (this.assignmentForm.invalid) return;

    const { name } = this.assignmentForm.value;
    if (name) this.data.name = name;

    const { file } = this.assignmentForm.value;
    if (file) this.data.setFile(file);

    const { encrypted } = this.assignmentForm.value;
    if (encrypted != null) this.data.encrypted = encrypted;

    const { key } = this.assignmentForm.value;
    if (key) this.data.setKey(key);
    this.data.save();
    this.dialogRef.close();
  }
}
