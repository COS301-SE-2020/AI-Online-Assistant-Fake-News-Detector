import { TestBed } from '@angular/core/testing';

import { DownloadPluginService } from './download-plugin.service';

describe('DownloadPluginService', () => {
  let service: DownloadPluginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadPluginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
