import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportAssignmentDialogComponent } from './export-assignment-dialog.component';

describe('ExportAssignmentDialogComponent', () => {
  let component: ExportAssignmentDialogComponent;
  let fixture: ComponentFixture<ExportAssignmentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExportAssignmentDialogComponent],
    });
    fixture = TestBed.createComponent(ExportAssignmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
