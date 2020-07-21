import { TestBed } from '@angular/core/testing';

import { DeleteSourceService } from './delete-source.service';

describe('DeleteSourceService', () => {
  let service: DeleteSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
