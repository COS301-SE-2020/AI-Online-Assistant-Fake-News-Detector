import { TestBed } from '@angular/core/testing';

import { SourceInputService } from './source-input.service';

describe('SourceInputService', () => {
  let service: SourceInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SourceInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
