import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ApprovalDetail } from './approval-detail';

describe('ApprovalDetail', () => {
  let component: ApprovalDetail;
  let fixture: ComponentFixture<ApprovalDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalDetail, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        { provide: Router, useValue: { navigate: () => Promise.resolve(true), navigateByUrl: () => Promise.resolve(true), url: '/business-finance/approvals', events: of([]) } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {}, paramMap: { get: () => null } }, paramMap: { get: () => null } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

