import { TestBed } from '@angular/core/testing';

import { CpsMdocViewerService } from './cps-mdoc-viewer.service';

describe('CpsMdocViewerService', () => {
  let service: CpsMdocViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CpsMdocViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
