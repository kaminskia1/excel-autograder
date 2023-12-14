import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueLengthReviewComponent } from './value-length-review.component';

describe('ValueLengthFacetReviewComponent', () => {
  let component: ValueLengthReviewComponent;
  let fixture: ComponentFixture<ValueLengthReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValueLengthReviewComponent],
    });
    fixture = TestBed.createComponent(ValueLengthReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
