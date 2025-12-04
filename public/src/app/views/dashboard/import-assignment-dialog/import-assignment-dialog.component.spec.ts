import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';

import { ImportAssignmentDialogComponent } from './import-assignment-dialog.component';

describe('ImportAssignmentDialogComponent', () => {
  let component: ImportAssignmentDialogComponent;
  let fixture: ComponentFixture<ImportAssignmentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MatSnackBarModule, HttpClientTestingModule],
      declarations: [ImportAssignmentDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: new EventEmitter() },
        { provide: MatDialogRef, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ImportAssignmentDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
