import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { ExportAssignmentDialogComponent } from './export-assignment-dialog.component';

describe('ExportAssignmentDialogComponent', () => {
  let component: ExportAssignmentDialogComponent;
  let fixture: ComponentFixture<ExportAssignmentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClipboardModule],
      declarations: [ExportAssignmentDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { data: '' } },
        { provide: MatDialogRef, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ExportAssignmentDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
