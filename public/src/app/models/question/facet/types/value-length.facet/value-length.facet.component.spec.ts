import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueLengthFacetComponent } from './value-length.facet.component';

describe('ValueFacetComponent', () => {
  let component: ValueLengthFacetComponent;
  let fixture: ComponentFixture<ValueLengthFacetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValueLengthFacetComponent],
    });
    fixture = TestBed.createComponent(ValueLengthFacetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
