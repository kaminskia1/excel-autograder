import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueCreateComponent } from './value-create.component';

describe('ValueFacetComponent', () => {
  let component: ValueCreateComponent;
  let fixture: ComponentFixture<ValueCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValueCreateComponent],
    });
    fixture = TestBed.createComponent(ValueCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
