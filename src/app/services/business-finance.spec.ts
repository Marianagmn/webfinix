import { TestBed } from '@angular/core/testing';

import { BusinessFinanceService } from './business-finance.service';

describe('BusinessFinanceService', () => {
  let service: BusinessFinanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessFinanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
