import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AssignmentService } from './assignment.service';
import { ApiService } from '../../services/api/api.service';

describe('AssignmentService', () => {
  let service: AssignmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService, AssignmentService]
    });
    service = TestBed.inject(AssignmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
