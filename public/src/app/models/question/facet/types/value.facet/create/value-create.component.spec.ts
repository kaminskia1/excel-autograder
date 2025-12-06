import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ValueCreateComponent } from './value-create.component';

describe('ValueFacetComponent', () => {
  let component: ValueCreateComponent;
  let fixture: ComponentFixture<ValueCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValueCreateComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ValueCreateComponent);
    component = fixture.componentInstance;
    component.facet = { value: '', flag: 0 } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
