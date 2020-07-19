import { TestBed } from '@angular/core/testing';

import { FactInputService } from './fact-input.service';

describe('FactInputService', () => {
  let service: FactInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
