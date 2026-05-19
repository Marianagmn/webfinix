import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessEdit } from './business-edit';

describe('BusinessEdit', () => {
  let component: BusinessEdit;
  let fixture: ComponentFixture<BusinessEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
