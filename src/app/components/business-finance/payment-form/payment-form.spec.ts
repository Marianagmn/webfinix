import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { PaymentForm } from './payment-form';

describe('PaymentForm', () => {
  let component: PaymentForm;
  let fixture: ComponentFixture<PaymentForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentForm, RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
