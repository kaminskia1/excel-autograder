import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAssignmentDialogComponent } from './new-assignment-dialog.component';

describe('NewAssignmentDialogComponent', () => {
  let component: NewAssignmentDialogComponent;
  let fixture: ComponentFixture<NewAssignmentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewAssignmentDialogComponent]
    });
    fixture = TestBed.createComponent(NewAssignmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
