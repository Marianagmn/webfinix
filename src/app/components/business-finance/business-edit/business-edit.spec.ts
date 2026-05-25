import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BusinessEdit } from './business-edit';

describe('BusinessEdit', () => {
  let component: BusinessEdit;
  let fixture: ComponentFixture<BusinessEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({    imports: [BusinessEdit, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

