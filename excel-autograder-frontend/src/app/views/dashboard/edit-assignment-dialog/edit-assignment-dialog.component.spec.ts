import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssignmentDialogComponent } from './edit-assignment-dialog.component';

describe('RenameAssignmentDialogComponent', () => {
  let component: EditAssignmentDialogComponent;
  let fixture: ComponentFixture<EditAssignmentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAssignmentDialogComponent]
    });
    fixture = TestBed.createComponent(EditAssignmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
