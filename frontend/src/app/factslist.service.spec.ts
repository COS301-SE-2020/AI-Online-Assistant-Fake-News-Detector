import { TestBed } from '@angular/core/testing';

import { FactslistService } from './factslist.service';

describe('FactslistService', () => {
  let service: FactslistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactslistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
