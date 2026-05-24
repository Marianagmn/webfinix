import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.locator('h1')).toContainText('Iniciar Sesión');
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/auth/login');
    await page.click('button[type="submit"]');
    await expect(page.locator('.text-danger')).toBeVisible();
  });

  test('should navigate to dashboard after successful login', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });
});
