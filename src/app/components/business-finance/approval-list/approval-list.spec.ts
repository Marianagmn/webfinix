import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApprovalList } from './approval-list';

describe('ApprovalList', () => {
  let component: ApprovalList;
  let fixture: ComponentFixture<ApprovalList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({    imports: [ApprovalList, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot(), RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
