import { TestBed } from '@angular/core/testing';

import { AbstractApiService } from './api.service';

describe('ApiService', () => {
  let service: AbstractApiService<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbstractApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
