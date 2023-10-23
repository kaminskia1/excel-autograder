import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaContainsFacetComponent } from './formula-contains-facet.component';

describe('FormulaContainsFacetComponent', () => {
  let component: FormulaContainsFacetComponent;
  let fixture: ComponentFixture<FormulaContainsFacetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaContainsFacetComponent],
    });
    fixture = TestBed.createComponent(FormulaContainsFacetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
