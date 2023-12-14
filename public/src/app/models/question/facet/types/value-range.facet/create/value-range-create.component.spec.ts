import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueRangeCreateComponent } from './value-range-create.component';

describe('ValueRangeFacetComponent', () => {
  let component: ValueRangeCreateComponent;
  let fixture: ComponentFixture<ValueRangeCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValueRangeCreateComponent],
    });
    fixture = TestBed.createComponent(ValueRangeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
