import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessList } from './business-list';

describe('BusinessList', () => {
  let component: BusinessList;
  let fixture: ComponentFixture<BusinessList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessList],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
