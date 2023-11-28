import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueRangeFacetComponent } from './value-range.facet.component';

describe('ValueRangeFacetComponent', () => {
  let component: ValueRangeFacetComponent;
  let fixture: ComponentFixture<ValueRangeFacetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValueRangeFacetComponent],
    });
    fixture = TestBed.createComponent(ValueRangeFacetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
