import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { FormulaListCreateComponent } from './formula-list-create.component';

describe('FunctionListFacetComponent', () => {
  let component: FormulaListCreateComponent;
  let fixture: ComponentFixture<FormulaListCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaListCreateComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(FormulaListCreateComponent);
    component = fixture.componentInstance;
    component.facet = { functions: [] } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
