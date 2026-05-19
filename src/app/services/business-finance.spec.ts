import { TestBed } from '@angular/core/testing';

import { BusinessFinance } from './business-finance';

describe('BusinessFinance', () => {
  let service: BusinessFinance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessFinance);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
