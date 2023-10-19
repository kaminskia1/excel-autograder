import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionListFacetComponent } from './function-list.facet.component';

describe('FunctionListFacetComponent', () => {
  let component: FunctionListFacetComponent;
  let fixture: ComponentFixture<FunctionListFacetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FunctionListFacetComponent],
    });
    fixture = TestBed.createComponent(FunctionListFacetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
