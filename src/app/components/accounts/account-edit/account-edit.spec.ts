import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountEdit } from './account-edit';

describe('AccountEdit', () => {
  let component: AccountEdit;
  let fixture: ComponentFixture<AccountEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({    imports: [AccountEdit, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot(), RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
