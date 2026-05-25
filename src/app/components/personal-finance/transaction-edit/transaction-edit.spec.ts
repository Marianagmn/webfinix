import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionEdit } from './transaction-edit';

describe('TransactionEdit', () => {
  let component: TransactionEdit;
  let fixture: ComponentFixture<TransactionEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({    imports: [TransactionEdit, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

