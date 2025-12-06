import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ValueRangeCreateComponent } from './value-range-create.component';

describe('ValueRangeFacetComponent', () => {
  let component: ValueRangeCreateComponent;
  let fixture: ComponentFixture<ValueRangeCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValueRangeCreateComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ValueRangeCreateComponent);
    component = fixture.componentInstance;
    component.facet = { min: 0, max: 100 } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
