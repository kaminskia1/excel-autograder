import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ValueLengthCreateComponent } from './value-length-create.component';

describe('ValueFacetComponent', () => {
  let component: ValueLengthCreateComponent;
  let fixture: ComponentFixture<ValueLengthCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValueLengthCreateComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ValueLengthCreateComponent);
    component = fixture.componentInstance;
    component.facet = { min: 0, max: 100 } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
