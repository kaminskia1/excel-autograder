import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueRangeReviewComponent } from './value-range-review.component';

describe('ValueRangeFacetReviewComponent', () => {
  let component: ValueRangeReviewComponent;
  let fixture: ComponentFixture<ValueRangeReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValueRangeReviewComponent],
    });
    fixture = TestBed.createComponent(ValueRangeReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
