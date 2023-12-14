import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaContainsReviewComponent } from './formula-contains-review.component';

describe('FormulaContainsFacetReviewComponent', () => {
  let component: FormulaContainsReviewComponent;
  let fixture: ComponentFixture<FormulaContainsReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaContainsReviewComponent],
    });
    fixture = TestBed.createComponent(FormulaContainsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
