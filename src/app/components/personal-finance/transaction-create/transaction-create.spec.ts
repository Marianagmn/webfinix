import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionCreate } from './transaction-create';

describe('TransactionCreate', () => {
  let component: TransactionCreate;
  let fixture: ComponentFixture<TransactionCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({    imports: [TransactionCreate, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

