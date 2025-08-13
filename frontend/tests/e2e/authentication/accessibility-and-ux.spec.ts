import { test, expect } from '@playwright/test';

test.describe('사용자 경험, 접근성, 보안 테스트', () => {
    const BASE_URL = 'http://localhost:3000/signin';
    const TEST_EMAIL = `test123@example.com`;
    const TEST_PASSWORD = '123567as#';

    test.beforeEach(async ({ page }) => await page.goto(BASE_URL));

    test.describe('로그인, 회원가입 페이지 간 이동', () => {
        test('로그인 페이지와 회원가입 페이지는 서로 이동할 수 있어야 한다.', async ({ page }) => {
            await page.locator('a:has-text("회원가입")').click();
            await expect(page).toHaveURL(/.*signup.*/);
            await expect(page.locator('h1:has-text("회원가입")')).toBeVisible();

            await page.locator('a:has-text("로그인")').click();
            await expect(page).toHaveURL(/.*signin.*/);
            await expect(page.locator('h1:has-text("로그인")')).toBeVisible();
        });
    });

    test.describe('사용자 경험 및 접근성', () => {
        test('폼 필드 라벨이 명확히 존재해야 한다.', async ({ page }) => {
            const emailInput = page.getByRole('textbox', { name: '이메일' });
            await expect(emailInput).toBeVisible();

            const passwordInput = page.getByRole('textbox', { name: '비밀번호' });
            await expect(passwordInput).toBeVisible();

            await emailInput.focus();
            await expect(emailInput).toBeFocused();

            await page.keyboard.press('Tab');
            await expect(passwordInput).toBeFocused();
        });

        test('반응형 디자인이 적용되어 있어야 한다.', async ({ page }) => {
            await page.setViewportSize({ width: 1200, height: 800 });
            await expect(page.locator('form[aria-label="로그인 폼"]')).toBeVisible();

            await page.setViewportSize({ width: 768, height: 1024 });
            await expect(page.locator('form[aria-label="로그인 폼"]')).toBeVisible();

            await page.setViewportSize({ width: 375, height: 667 });
            await expect(page.locator('form[aria-label="로그인 폼"]')).toBeVisible();
        });

        test('로그인 버튼 클릭 시, 로딩 상태가 표시되어야 한다.', async ({ page }) => {
            await page.getByRole('textbox', { name: '이메일' }).fill(TEST_EMAIL);
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_PASSWORD);

            const loginButton = page.getByRole('button', { name: '로그인', exact: true });
            await loginButton.click();

            await page.waitForLoadState('networkidle', { timeout: 3000 });

            expect(page.url()).not.toContain('/signin');
        });

        test('비로그인 상태에서 보유자산, 거래내역 링크는 클릭할 수 없어야 한다.', async ({ page }) => {
            await expect(page.locator('span:has-text("보유 자산")[aria-disabled="true"]')).toBeVisible();
            await expect(page.locator('span:has-text("거래내역")[aria-disabled="true"]')).toBeVisible();
        });
    });

    test.describe('보안 테스트', () => {
        test('SQL Injection을 방어해야 한다.', async ({ page }) => {
            const sqlInjectionPayload = "'; DROP TABLE users; --";
            await page.getByRole('textbox', { name: '이메일' }).fill(sqlInjectionPayload);
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_PASSWORD);
            await page.getByRole('button', { name: '로그인', exact: true }).click();

            await page.waitForLoadState('networkidle');

            await expect(page.locator('form[aria-label="로그인 폼"]')).toBeVisible();
        });

        test('XSS 공격을 방어해야 한다.', async ({ page }) => {
            const xssPayload = '<script>alert("XSS")</script>';
            await page.getByRole('textbox', { name: '이메일' }).fill(xssPayload);
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_PASSWORD);
            await page.getByRole('button', { name: '로그인', exact: true }).click();

            page.on('dialog', async (dialog) => {
                expect(dialog.message()).not.toBe('XSS');
                await dialog.dismiss();
            });

            await page.waitForTimeout(2000);
        });
    });
});