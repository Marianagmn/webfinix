import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { AccountEdit } from './account-edit';

describe('AccountEdit', () => {
  let component: AccountEdit;
  let fixture: ComponentFixture<AccountEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountEdit, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), navigateByUrl: () => Promise.resolve(true), url: '/accounts', events: of([]) } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {}, paramMap: { get: () => null } }, paramMap: { get: () => null } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

