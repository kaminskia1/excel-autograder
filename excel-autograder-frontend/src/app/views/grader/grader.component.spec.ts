import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraderComponent } from './grader.component';

describe('GraderComponent', () => {
  let component: GraderComponent;
  let fixture: ComponentFixture<GraderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraderComponent]
    });
    fixture = TestBed.createComponent(GraderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
