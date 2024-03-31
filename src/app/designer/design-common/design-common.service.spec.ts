import {TestBed} from '@angular/core/testing';

import {DesignCommonService} from './design-common.service';

describe('DesignCommonService', () => {
  let service: DesignCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
