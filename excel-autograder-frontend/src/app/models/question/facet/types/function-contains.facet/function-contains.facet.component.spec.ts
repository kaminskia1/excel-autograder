import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionContainsFacetComponent } from './function-contains.facet.component';

describe('FunctionContainsFacetComponent', () => {
  let component: FunctionContainsFacetComponent;
  let fixture: ComponentFixture<FunctionContainsFacetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FunctionContainsFacetComponent],
    });
    fixture = TestBed.createComponent(FunctionContainsFacetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
