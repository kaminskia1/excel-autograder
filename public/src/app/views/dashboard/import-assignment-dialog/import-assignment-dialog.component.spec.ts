import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAssignmentDialogComponent } from './import-assignment-dialog.component';

describe('ImportAssignmentDialogComponent', () => {
  let component: ImportAssignmentDialogComponent;
  let fixture: ComponentFixture<ImportAssignmentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportAssignmentDialogComponent],
    });
    fixture = TestBed.createComponent(ImportAssignmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
