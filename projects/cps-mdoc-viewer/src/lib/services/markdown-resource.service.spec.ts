import { TestBed } from '@angular/core/testing';

import { MarkdownResourceService } from './markdown-resource.service';

describe('MarkdownResourceServiceService', () => {
  let service: MarkdownResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkdownResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
