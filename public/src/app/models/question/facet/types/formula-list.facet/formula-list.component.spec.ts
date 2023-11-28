import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaListComponent } from './formula-list.component';

describe('FunctionListFacetComponent', () => {
  let component: FormulaListComponent;
  let fixture: ComponentFixture<FormulaListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaListComponent],
    });
    fixture = TestBed.createComponent(FormulaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
