import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaRegexFacetComponent } from './formula-regex.facet.component';

describe('FormulaRegexFacetComponent', () => {
  let component: FormulaRegexFacetComponent;
  let fixture: ComponentFixture<FormulaRegexFacetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaRegexFacetComponent]
    });
    fixture = TestBed.createComponent(FormulaRegexFacetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
