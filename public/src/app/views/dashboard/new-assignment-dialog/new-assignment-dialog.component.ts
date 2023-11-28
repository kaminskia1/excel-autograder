import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import {
  Assignment,
  IAssignment, IAssignmentPartial,
} from '../../../models/assignment/assignment';
import { AssignmentFactory } from '../../../models/assignment/assignment.factory';

@Component({
  selector: 'app-new-assignment-dialog',
  templateUrl: './new-assignment-dialog.component.html',
  styleUrls: ['./new-assignment-dialog.component.scss'],
})
export class NewAssignmentDialogComponent {
  newAssignmentForm;

  newAssignment: Assignment;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewAssignmentDialogComponent>,
    public assignmentFactory: AssignmentFactory,
    @Inject(MAT_DIALOG_DATA) public data: EventEmitter<IAssignment|null>,
  ) {
    this.newAssignment = this.assignmentFactory.createAssignment({} as IAssignmentPartial);
    this.newAssignmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      file: [null, Validators.required],
      encrypted: [false],
      key: [''],
      questions: [[]],
    });

    this.newAssignmentForm.get('encrypted')?.valueChanges.subscribe((value) => {
      if (value) {
        this.newAssignmentForm.get('key')?.setValidators([Validators.required]);
      } else {
        this.newAssignmentForm.get('key')?.clearValidators();
      }
      this.newAssignmentForm.get('key')?.updateValueAndValidity();
    });
  }

  create() {
    if (this.newAssignmentForm.invalid) return;

    const { name } = this.newAssignmentForm.value;
    if (name) this.newAssignment.name = name;

    const { file } = this.newAssignmentForm.value;
    if (file) this.newAssignment.setFile(file);

    const { encrypted } = this.newAssignmentForm.value;
    if (encrypted != null) this.newAssignment.encrypted = encrypted;

    const { key } = this.newAssignmentForm.value;
    if (key) this.newAssignment.setKey(key);
    this.data.emit(this.newAssignment);
    this.dialogRef.close();
  }
}
