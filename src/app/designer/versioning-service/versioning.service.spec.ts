import { TestBed } from '@angular/core/testing';

import { VersioningService } from './versioning.service';

describe('VersioningService', () => {
  let service: VersioningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VersioningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
