import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueFacetComponent } from './value.facet.component';

describe('ValueFacetComponent', () => {
  let component: ValueFacetComponent;
  let fixture: ComponentFixture<ValueFacetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValueFacetComponent],
    });
    fixture = TestBed.createComponent(ValueFacetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
