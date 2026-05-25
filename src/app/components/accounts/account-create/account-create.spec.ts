import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountCreate } from './account-create';

describe('AccountCreate', () => {
  let component: AccountCreate;
  let fixture: ComponentFixture<AccountCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({    imports: [AccountCreate, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

