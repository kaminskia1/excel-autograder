import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';

import { NewAssignmentDialogComponent } from './new-assignment-dialog.component';

describe('NewAssignmentDialogComponent', () => {
  let component: NewAssignmentDialogComponent;
  let fixture: ComponentFixture<NewAssignmentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      declarations: [NewAssignmentDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: new EventEmitter() },
        { provide: MatDialogRef, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(NewAssignmentDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
