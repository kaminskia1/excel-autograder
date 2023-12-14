import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaRegexCreateComponent } from './formula-regex-create.component';

describe('FormulaRegexFacetComponent', () => {
  let component: FormulaRegexCreateComponent;
  let fixture: ComponentFixture<FormulaRegexCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaRegexCreateComponent],
    });
    fixture = TestBed.createComponent(FormulaRegexCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
