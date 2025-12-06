import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { InfoDialogComponent } from './info-dialog.component';

describe('WorkInProgressDialogComponent', () => {
  let component: InfoDialogComponent;
  let fixture: ComponentFixture<InfoDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { title: 'Test', message: 'Test' } },
        { provide: MatDialogRef, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(InfoDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
