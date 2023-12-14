import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaListCreateComponent } from './formula-list-create.component';

describe('FunctionListFacetComponent', () => {
  let component: FormulaListCreateComponent;
  let fixture: ComponentFixture<FormulaListCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaListCreateComponent],
    });
    fixture = TestBed.createComponent(FormulaListCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
