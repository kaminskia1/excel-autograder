import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { FormulaRegexCreateComponent } from './formula-regex-create.component';

describe('FormulaRegexFacetComponent', () => {
  let component: FormulaRegexCreateComponent;
  let fixture: ComponentFixture<FormulaRegexCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaRegexCreateComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(FormulaRegexCreateComponent);
    component = fixture.componentInstance;
    component.facet = { regex: '' } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
