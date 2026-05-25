// src/test/integration/auth.service.spec.ts
// PHASE 5 FIX: Integration tests for AuthService
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../../app/services/auth.service';
import { environment } from '../../environments/environment';

describe('AuthService Integration Tests', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const credentials = { email: 'test@example.com', password: 'password123' };
    const mockResponse = {
      success: true,
      data: {
        accessToken: 'mock-token',
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
      },
    };

    service.login(credentials).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data.accessToken).toBe('mock-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should refresh token successfully', () => {
    const mockResponse = {
      success: true,
      data: {
        accessToken: 'new-token',
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
      },
    };

    service.refresh().subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data.accessToken).toBe('new-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout successfully', () => {
    const mockResponse = { success: true };

    service.logout().subscribe(response => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
