import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { BusinessEdit } from './business-edit';

describe('BusinessEdit', () => {
  let component: BusinessEdit;
  let fixture: ComponentFixture<BusinessEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessEdit, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), navigateByUrl: () => Promise.resolve(true), url: '/business-finance', events: of([]) } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {}, paramMap: { get: () => null } }, paramMap: { get: () => null } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

