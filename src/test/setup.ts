// src/test/setup.ts
// Test setup file for Vitest
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/angular';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
