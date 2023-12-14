import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaListReviewComponent } from './formula-list-review.component';

describe('FormulaListFacetReviewComponent', () => {
  let component: FormulaListReviewComponent;
  let fixture: ComponentFixture<FormulaListReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaListReviewComponent],
    });
    fixture = TestBed.createComponent(FormulaListReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
