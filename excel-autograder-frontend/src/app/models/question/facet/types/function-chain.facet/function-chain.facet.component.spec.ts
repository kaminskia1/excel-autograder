import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionChainFacetComponent } from './function-chain.facet.component';

describe('FunctionChainFacetComponent', () => {
  let component: FunctionChainFacetComponent;
  let fixture: ComponentFixture<FunctionChainFacetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FunctionChainFacetComponent],
    });
    fixture = TestBed.createComponent(FunctionChainFacetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
