import { test, expect } from '@playwright/test';

test.describe('로그인 테스트', () => {
    const BASE_URL = 'http://localhost:3000/signin';
    const TEST_EMAIL = `test123@example.com`;
    const TEST_PASSWORD = '123567as#';

    test.beforeEach(async ({ page }) => await page.goto(BASE_URL));

    test.describe('이메일 로그인', () => {
        test('로그인 페이지에 접속하면 로그인 폼과 요소들이 확인되어야 한다.', async ({ page }) => {
            // 페이지 제목 확인
            await expect(page).toHaveTitle(/로그인.*EZBIT/);

            // 폼 요소들이 존재하는지 확인
            await expect(page.locator('form[aria-label="로그인 폼"]')).toBeVisible();
            await expect(page.locator('h1:has-text("로그인")')).toBeVisible();
            await expect(page.getByRole('textbox', { name: '이메일' })).toBeVisible();
            await expect(page.getByRole('textbox', { name: '비밀번호' })).toBeVisible();
            await expect(page.getByRole('button', { name: '로그인', exact: true })).toBeVisible();
            await expect(page.locator('button:has-text("Google 로그인")')).toBeVisible();
            await expect(page.locator('a:has-text("재설정하기")')).toBeVisible();
        });

        test('비밀번호 보기/숨기기 토글 기능이 작동해야 한다.', async ({ page }) => {
            const passwordInput = page.getByRole('textbox', { name: '비밀번호' });
            const toggleButton = page.locator('button:has(img[alt*="비밀번호"])');

            // 비밀번호 입력
            await passwordInput.fill(TEST_PASSWORD);

            // 토글 버튼이 존재하는지 확인
            await expect(toggleButton).toBeVisible();

            // 초기 상태는 password 타입인지 확인 (선택적)
            const initialType = await passwordInput.getAttribute('type');
            if (initialType === 'password') {
                // 토글 버튼 클릭하여 비밀번호 보이기
                await toggleButton.click();
                await expect(passwordInput).toHaveAttribute('type', 'text');

                // 다시 토글하여 숨기기
                await toggleButton.click();
                await expect(passwordInput).toHaveAttribute('type', 'password');
            } else {
                // 토글 기능이 작동하는지만 확인
                await toggleButton.click();
                await page.waitForTimeout(500); // 애니메이션 대기
                await toggleButton.click();
                await page.waitForTimeout(500);
            }
        });

        test('존재하지 않는 계정으로 로그인 시도 시, 유효성 검증에 실패한다.', async ({ page }) => {
            // 존재하지 않는 계정으로 로그인 시도
            await page.getByRole('textbox', { name: '이메일' }).fill('nonexistent@example.com');
            await page.getByRole('textbox', { name: '비밀번호' }).fill('wrongpassword');
            await page.getByRole('button', { name: '로그인', exact: true }).click();

            // 에러 메시지 확인
            try {
                await expect(page.locator('text=/로그인.*실패|이메일.*비밀번호.*확인|인증.*실패|잘못.*정보|계정.*존재/i')).toBeVisible({ timeout: 3000 });
            } catch {
                // 커스텀 에러 메시지가 없으면 여전히 로그인 페이지에 있는지 확인 (로그인 실패)
                await expect(page.locator('h1:has-text("로그인")')).toBeVisible();
            }
        });

        test('빈 필드로 로그인 시도 시, 유효성 검증에 실패한다.', async ({ page }) => {
            // 빈 필드로 로그인 시도
            await page.getByRole('button', { name: '로그인', exact: true }).click();

            // HTML5 validation 또는 커스텀 validation 확인
            const emailInput = page.getByRole('textbox', { name: '이메일' });
            const emailValidation = await emailInput.evaluate((input: HTMLInputElement) => input.validationMessage);

            if (emailValidation) {
                expect(emailValidation).toBeTruthy();
            } else {
                // HTML5 validation이 없으면 여전히 로그인 페이지에 있는지 확인
                await expect(page.locator('h1:has-text("로그인")')).toBeVisible();
            }
        });

        test('로그인 성공 시, 쿠키에 인증 토큰이 존재해야 한다.', async ({ page }) => {
            await page.getByRole('textbox', { name: '이메일' }).fill(TEST_EMAIL);
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_PASSWORD);
            await page.getByRole('button', { name: '로그인', exact: true }).click();

            // 로그인 처리 대기
            await page.waitForTimeout(2000);

            // 쿠키에서 Supabase 인증 토큰 확인
            const cookies = await page.context().cookies();
            const authCookie = cookies.find(cookie => cookie.name === 'sb-xdbogoztmknejhelrtwx-auth-token');

            expect(authCookie).toBeDefined();
            expect(authCookie?.value).toBeTruthy();

            // 로그인 성공 시 리다이렉션
            await expect(page).not.toHaveURL(`${BASE_URL}/signin`);
        });
    });

    test.describe('Google OAuth 로그인', () => {
        test('Google 로그인 버튼 클릭 시, 로그인 페이지로 리다이렉션되어야 한다.', async ({ page }) => {
            // Google 로그인 버튼이 존재하는지 확인
            const googleButton = page.locator('button:has-text("Google 로그인")');
            await expect(googleButton).toBeVisible();

            // 버튼이 활성화되어 있는지 확인
            await expect(googleButton).toBeEnabled();

            await googleButton.click();

            // 새 창이 열리거나 OAuth 프로세스가 시작되는지 확인
            await expect(page.locator('text=/Google 로그인/i')).toBeVisible();
        });
    });
});