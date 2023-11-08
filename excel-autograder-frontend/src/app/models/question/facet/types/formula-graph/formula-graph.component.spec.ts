import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaGraphComponent } from './formula-graph.component';

describe('FunctionChainFacetComponent', () => {
  let component: FormulaGraphComponent;
  let fixture: ComponentFixture<FormulaGraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaGraphComponent],
    });
    fixture = TestBed.createComponent(FormulaGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
