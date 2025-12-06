import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EditAssignmentDialogComponent } from './edit-assignment-dialog.component';

describe('RenameAssignmentDialogComponent', () => {
  let component: EditAssignmentDialogComponent;
  let fixture: ComponentFixture<EditAssignmentDialogComponent>;

  const mockAssignment = {
    name: 'Test Assignment',
    encrypted: false,
    getFile: () => of(new Blob()),
    setFile: () => {},
    setKey: () => {},
    save: () => of({}),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      declarations: [EditAssignmentDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockAssignment },
        { provide: MatDialogRef, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(EditAssignmentDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
