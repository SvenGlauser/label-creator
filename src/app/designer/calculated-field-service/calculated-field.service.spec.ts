import {TestBed} from '@angular/core/testing';

import {CalculatedFieldService} from './calculated-field.service';

describe('CalculatedFieldService', () => {
  let service: CalculatedFieldService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatedFieldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
