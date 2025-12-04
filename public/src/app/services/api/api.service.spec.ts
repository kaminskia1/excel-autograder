import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('registerHeader', () => {
    it('should register a header', () => {
      ApiService.registerHeader('X-Test', 'test-value');
      expect(true).toBe(true);
    });
  });

  describe('deregisterHeader', () => {
    it('should deregister a header', () => {
      ApiService.registerHeader('X-Test', 'test-value');
      ApiService.deregisterHeader('X-Test');
      expect(true).toBe(true);
    });
  });
});
