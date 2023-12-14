import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaContainsCreateComponent } from './formula-contains-create.component';

describe('FormulaContainsFacetComponent', () => {
  let component: FormulaContainsCreateComponent;
  let fixture: ComponentFixture<FormulaContainsCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaContainsCreateComponent],
    });
    fixture = TestBed.createComponent(FormulaContainsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
