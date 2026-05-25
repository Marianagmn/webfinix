// src/test/integration/auth-store.spec.ts
// PHASE 5 FIX: Integration tests for AuthStore
import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AuthStore } from '../../app/store/auth.store';
import { UserRole } from '../../app/models/user.model';

describe('AuthStore Integration Tests', () => {
  let store: AuthStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthStore],
    });

    store = TestBed.inject(AuthStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should set and get token', () => {
    store.setToken('test-token');
    expect(store.token()).toBe('test-token');
  });

  it('should set and get user', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      roles: ['user'] as UserRole[],
      provider: 'local',
      isActive: true,
      isEmailVerified: true,
      lastLoginAt: null,
      createdAt: new Date().toISOString(),
    };
    store.setUser(mockUser);
    expect(store.user()).toEqual(mockUser);
  });

  it('should return isAuthenticated correctly', () => {
    expect(store.isAuthenticated()).toBe(false);
    store.setToken('test-token');
    expect(store.isAuthenticated()).toBe(true);
  });

  it('should return roles correctly', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      roles: ['admin', 'user'] as UserRole[],
      provider: 'local',
      isActive: true,
      isEmailVerified: true,
      lastLoginAt: null,
      createdAt: new Date().toISOString(),
    };
    store.setUser(mockUser);
    expect(store.roles()).toEqual(['admin', 'user']);
  });

  it('should clear state', () => {
    store.setToken('test-token');
    store.setUser({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      roles: ['user'] as UserRole[],
      provider: 'local',
      isActive: true,
      isEmailVerified: true,
      lastLoginAt: null,
      createdAt: new Date().toISOString(),
    });
    store.clear();
    expect(store.token()).toBe(null);
    expect(store.user()).toBe(null);
    expect(store.isAuthenticated()).toBe(false);
  });
});
