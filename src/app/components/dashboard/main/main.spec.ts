import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Main } from './main';
import { PersonalFinanceService } from '../../../services/personal-finance.service';
import { AccountService } from '../../../services/account.service';
import { AuthStore } from '../../../store/auth.store';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

describe('Main (Dashboard)', () => {
  let component: Main;
  let fixture: ComponentFixture<Main>;
  let accountServiceSpy: jasmine.SpyObj<AccountService>;
  let financeServiceSpy: jasmine.SpyObj<PersonalFinanceService>;
  let authStoreSpy: jasmine.SpyObj<AuthStore>;
  let errorHandlerSpy: jasmine.SpyObj<ErrorHandlerService>;

  beforeEach(async () => {
    accountServiceSpy = jasmine.createSpyObj('AccountService', ['getAccounts']);
    financeServiceSpy = jasmine.createSpyObj('PersonalFinanceService', ['getTransactions']);
    authStoreSpy = jasmine.createSpyObj('AuthStore', ['user'], { user: signal({ name: 'Test User' }) });
    errorHandlerSpy = jasmine.createSpyObj('ErrorHandlerService', ['handleHttpError', 'handleSuccess']);

    await TestBed.configureTestingModule({
      imports: [Main],
      providers: [
        provideRouter([]),
        { provide: AccountService, useValue: accountServiceSpy },
        { provide: PersonalFinanceService, useValue: financeServiceSpy },
        { provide: AuthStore, useValue: authStoreSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Main);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial loading state', () => {
    expect(component.isLoading()).toBe(true);
  });

  it('should load accounts on init', () => {
    accountServiceSpy.getAccounts.and.returnValue(of([]));
    financeServiceSpy.getTransactions.and.returnValue(of({ data: [], meta: {} }));

    component.ngOnInit();
    fixture.detectChanges();

    expect(accountServiceSpy.getAccounts).toHaveBeenCalled();
  });

  it('should set accounts from service response', () => {
    const mockAccounts = [{ id: '1', nombre: 'Test Account', balance: 1000, isActive: true, moneda: 'COP', tipo: 'ahorro' }];
    accountServiceSpy.getAccounts.and.returnValue(of(mockAccounts as any));
    financeServiceSpy.getTransactions.and.returnValue(of({ data: [], meta: {} }));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.accounts()).toEqual(mockAccounts);
  });

  it('should handle account load error', () => {
    accountServiceSpy.getAccounts.and.returnValue(throwError(() => new Error('Load failed')));

    component.ngOnInit();
    fixture.detectChanges();

    expect(errorHandlerSpy.handleHttpError).toHaveBeenCalled();
    expect(component.isLoading()).toBe(false);
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(1000);
    expect(formatted).toContain('$');
  });

  it('should calculate income month correctly', () => {
    component.recentTransactions.set([
      { tipo: 'ingreso', monto: 100 } as any,
      { tipo: 'ingreso', monto: 200 } as any,
    ]);

    expect(component.incomeMonth()).toBe(300);
  });

  it('should calculate expense month correctly', () => {
    component.recentTransactions.set([
      { tipo: 'gasto', monto: 50 } as any,
      { tipo: 'gasto', monto: 30 } as any,
    ]);

    expect(component.expenseMonth()).toBe(80);
  });
});
