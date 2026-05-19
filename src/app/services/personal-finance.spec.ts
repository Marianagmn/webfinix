import { TestBed } from '@angular/core/testing';

import { PersonalFinance } from './personal-finance';

describe('PersonalFinance', () => {
  let service: PersonalFinance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalFinance);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
