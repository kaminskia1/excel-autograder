import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { FormulaContainsCreateComponent } from './formula-contains-create.component';

describe('FormulaContainsFacetComponent', () => {
  let component: FormulaContainsCreateComponent;
  let fixture: ComponentFixture<FormulaContainsCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaContainsCreateComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(FormulaContainsCreateComponent);
    component = fixture.componentInstance;
    component.facet = { search: '' } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
