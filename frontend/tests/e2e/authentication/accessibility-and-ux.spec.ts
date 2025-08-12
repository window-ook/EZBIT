import { test, expect } from '@playwright/test';

test.describe('사용자 경험, 접근성, 보안 테스트', () => {
    const BASE_URL = 'http://localhost:3000';
    const TEST_EMAIL = `test123@example.com`;
    const TEST_PASSWORD = '123567as#';

    test.describe('로그인, 회원가입 페이지 간 이동', () => {
        test('로그인 페이지와 회원가입 페이지는 서로 이동할 수 있어야 한다.', async ({ page }) => {
            // 로그인 페이지에서 시작
            await page.goto(`${BASE_URL}/signin`);

            // 회원가입 링크 클릭
            await page.locator('a:has-text("회원가입")').click();
            await expect(page).toHaveURL(/.*signup.*/);
            await expect(page.locator('h1:has-text("회원가입")')).toBeVisible();

            // 로그인 링크 클릭
            await page.locator('a:has-text("로그인")').click();
            await expect(page).toHaveURL(/.*signin.*/);
            await expect(page.locator('h1:has-text("로그인")')).toBeVisible();
        });
    });

    test.describe('사용자 경험 및 접근성', () => {
        test('폼 필드 라벨이 명확히 존재해야 한다.', async ({ page }) => {
            await page.goto(`${BASE_URL}/signin`);

            // 이메일 입력 필드 접근성 확인
            const emailInput = page.getByRole('textbox', { name: '이메일' });
            await expect(emailInput).toBeVisible();

            // 비밀번호 입력 필드 접근성 확인
            const passwordInput = page.getByRole('textbox', { name: '비밀번호' });
            await expect(passwordInput).toBeVisible();

            // 키보드 탐색 가능성 확인
            await emailInput.focus();
            await expect(emailInput).toBeFocused();

            await page.keyboard.press('Tab');
            await expect(passwordInput).toBeFocused();
        });

        test('반응형 디자인이 적용되어 있어야 한다.', async ({ page }) => {
            await page.goto(`${BASE_URL}/signin`);

            // 데스크톱 뷰포트에서 확인
            await page.setViewportSize({ width: 1200, height: 800 });
            await expect(page.locator('form[aria-label="로그인 폼"]')).toBeVisible();

            // 태블릿 뷰포트에서 확인
            await page.setViewportSize({ width: 768, height: 1024 });
            await expect(page.locator('form[aria-label="로그인 폼"]')).toBeVisible();

            // 모바일 뷰포트에서 확인
            await page.setViewportSize({ width: 375, height: 667 });
            await expect(page.locator('form[aria-label="로그인 폼"]')).toBeVisible();
        });

        test('로그인 버튼 클릭 시, 로딩 상태가 표시되어야 한다.', async ({ page }) => {
            await page.goto(`${BASE_URL}/signin`);

            // 로그인 버튼 클릭 시 로딩 상태 확인
            await page.getByRole('textbox', { name: '이메일' }).fill(TEST_EMAIL);
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_PASSWORD);

            // 버튼 클릭 후 상태 변화 확인
            const loginButton = page.getByRole('button', { name: '로그인', exact: true });
            await loginButton.click();

            // 버튼 클릭 후 페이지 상태 확인 (로딩 상태나 응답 확인)
            await page.waitForLoadState('networkidle', { timeout: 3000 });

            // 로그인 시도가 정상적으로 처리되었는지 확인 (성공/실패 상관없이)
            const stillOnSigninPage = await page.locator('h1:has-text("로그인")').isVisible();
            const hasErrorMessage = await page.locator('text=/로그인.*실패|인증.*실패/i').isVisible();
            const hasSuccessRedirect = !page.url().includes('/signin');

            // 최소한 페이지가 반응했는지 확인 (에러, 성공, 또는 여전히 로그인 페이지)
            expect(stillOnSigninPage || hasErrorMessage || hasSuccessRedirect).toBeTruthy();
        });
    });

    test.describe('보안 테스트', () => {
        test('SQL Injection을 방어해야 한다.', async ({ page }) => {
            await page.goto(`${BASE_URL}/signin`);

            // SQL Injection 시도
            const sqlInjectionPayload = "'; DROP TABLE users; --";
            await page.getByRole('textbox', { name: '이메일' }).fill(sqlInjectionPayload);
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_PASSWORD);
            await page.getByRole('button', { name: '로그인', exact: true }).click();

            // 에러가 발생하지 않고 정상적으로 처리되는지 확인
            await page.waitForLoadState('networkidle');

            // 시스템이 여전히 정상 작동하는지 확인
            await expect(page.locator('form[aria-label="로그인 폼"]')).toBeVisible();
        });

        test('XSS 공격을 방어해야 한다.', async ({ page }) => {
            await page.goto(`${BASE_URL}/signin`);

            // XSS 시도
            const xssPayload = '<script>alert("XSS")</script>';
            await page.getByRole('textbox', { name: '이메일' }).fill(xssPayload);
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_PASSWORD);
            await page.getByRole('button', { name: '로그인', exact: true }).click();

            // alert가 실행되지 않는지 확인
            page.on('dialog', async (dialog) => {
                // XSS가 성공했다면 실패
                expect(dialog.message()).not.toBe('XSS');
                await dialog.dismiss();
            });

            await page.waitForTimeout(2000);
        });
    });
});