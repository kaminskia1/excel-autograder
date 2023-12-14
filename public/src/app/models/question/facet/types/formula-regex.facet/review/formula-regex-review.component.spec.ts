import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaRegexReviewComponent } from './formula-regex-review.component';

describe('FormulaRegexFacetReviewComponent', () => {
  let component: FormulaRegexReviewComponent;
  let fixture: ComponentFixture<FormulaRegexReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaRegexReviewComponent],
    });
    fixture = TestBed.createComponent(FormulaRegexReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
