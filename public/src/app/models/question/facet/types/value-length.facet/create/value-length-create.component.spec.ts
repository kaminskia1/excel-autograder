import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueLengthCreateComponent } from './value-length-create.component';

describe('ValueFacetComponent', () => {
  let component: ValueLengthCreateComponent;
  let fixture: ComponentFixture<ValueLengthCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValueLengthCreateComponent],
    });
    fixture = TestBed.createComponent(ValueLengthCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
