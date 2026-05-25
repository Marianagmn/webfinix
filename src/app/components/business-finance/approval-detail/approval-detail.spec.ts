import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApprovalDetail } from './approval-detail';

describe('ApprovalDetail', () => {
  let component: ApprovalDetail;
  let fixture: ComponentFixture<ApprovalDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({    imports: [ApprovalDetail, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

