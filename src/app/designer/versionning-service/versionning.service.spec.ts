import { TestBed } from '@angular/core/testing';

import { VersionningService } from './versionning.service';

describe('VersionningService', () => {
  let service: VersionningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VersionningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
