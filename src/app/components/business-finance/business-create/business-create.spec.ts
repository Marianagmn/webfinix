import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BusinessCreate } from './business-create';

describe('BusinessCreate', () => {
  let component: BusinessCreate;
  let fixture: ComponentFixture<BusinessCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({    imports: [BusinessCreate, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
