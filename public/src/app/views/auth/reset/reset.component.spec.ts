import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResetComponent } from './reset.component';
import { UserService } from '../../../models/user/user.service';
import { ApiService } from '../../../services/api/api.service';
import { UserFactory } from '../../../models/user/user.factory';

describe('ResetComponent', () => {
  let component: ResetComponent;
  let fixture: ComponentFixture<ResetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [ResetComponent],
      providers: [ApiService, UserFactory, UserService],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ResetComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
