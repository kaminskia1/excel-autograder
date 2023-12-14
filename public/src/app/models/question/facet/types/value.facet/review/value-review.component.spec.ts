import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueReviewComponent } from './value-review.component';

describe('ValueFacetReviewComponent', () => {
  let component: ValueReviewComponent;
  let fixture: ComponentFixture<ValueReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValueReviewComponent],
    });
    fixture = TestBed.createComponent(ValueReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
