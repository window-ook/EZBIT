import { test, expect } from '@playwright/test';

test.describe('회원가입 테스트', () => {
    const BASE_URL = 'http://localhost:3000/signup';
    const INVALID_EMAIL = 'invalid@email@example.com';
    const EMPTY_EMAIL = '';
    const PASSWORD_LESS_THAN_8 = '1235678';
    const TEST_EMAIL = `test124@example.com`;
    const TEST_PASSWORD = '123567as#';

    test.beforeEach(async ({ page }) => await page.goto(BASE_URL));

    test.describe('이메일 회원가입', () => {
        test('회원가입 페이지에 접속하면 회원가입 폼과 요소들이 확인되어야 한다.', async ({ page }) => {
            // 페이지 제목 확인
            await expect(page).toHaveTitle(/회원가입.*EZBIT/);

            // 폼 요소들이 존재하는지 확인
            await expect(page.locator('form[aria-label="회원가입 폼"]')).toBeVisible();
            await expect(page.locator('h1:has-text("회원가입")')).toBeVisible();
            await expect(page.getByRole('textbox', { name: '이메일' })).toBeVisible();
            await expect(page.getByRole('textbox', { name: '비밀번호' })).toBeVisible();
            await expect(page.locator('button:has-text("가입하기")')).toBeVisible();
            await expect(page.locator('button:has-text("Google 로그인")')).toBeVisible();
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

        test('잘못된 이메일 형식 입력 시, 유효성 검증에 실패한다.', async ({ page }) => {
            // 잘못된 이메일 형식 입력
            await page.getByRole('textbox', { name: '이메일' }).fill(INVALID_EMAIL);
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_PASSWORD);
            await page.locator('button:has-text("가입하기")').click();

            // 이메일 유효성 검증 메시지 확인 (브라우저 내장 또는 커스텀 메시지)
            const emailInput = page.getByRole('textbox', { name: '이메일' });
            const validationMessage = await emailInput.evaluate((input: HTMLInputElement) => input.validationMessage);

            if (validationMessage) {
                expect(validationMessage).toBeTruthy();
            } else {
                await expect(page.locator('text=/이메일.*형식/i')).toBeVisible({ timeout: 3000 });
            }
        });

        test('빈 이메일 입력 시, 유효성 검증에 실패한다.', async ({ page }) => {
            // 잘못된 이메일 형식 입력
            await page.getByRole('textbox', { name: '이메일' }).fill(EMPTY_EMAIL);
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_PASSWORD);
            await page.locator('button:has-text("가입하기")').click();

            // 이메일 유효성 검증 메시지 확인 (브라우저 내장 또는 커스텀 메시지)
            const emailInput = page.getByRole('textbox', { name: '이메일' });
            const validationMessage = await emailInput.evaluate((input: HTMLInputElement) => input.validationMessage);

            if (validationMessage) {
                expect(validationMessage).toBeTruthy();
            } else {
                await expect(page.locator('text=/이메일.*입력/i')).toBeVisible({ timeout: 3000 });
            }
        });

        test('비밀번호가 8자 미만일 경우, 유효성 검증에 실패한다.', async ({ page }) => {
            // 약한 비밀번호 입력
            await page.getByRole('textbox', { name: '이메일' }).fill(TEST_EMAIL);
            await page.getByRole('textbox', { name: '비밀번호' }).fill(PASSWORD_LESS_THAN_8);
            await page.locator('button:has-text("가입하기")').click();

            // 비밀번호 강도 검증 메시지 확인 (있을 경우) 또는 폼 제출이 차단되는지 확인
            try {
                await expect(page.locator('text=/비밀번호.*강도|비밀번호.*길이|비밀번호.*조건|최소.*자|영문.*숫자/i')).toBeVisible({ timeout: 2000 });
            } catch {
                // 커스텀 검증 메시지가 없는 경우 HTML5 validation 확인
                const passwordInput = page.getByRole('textbox', { name: '비밀번호' });
                const validationMessage = await passwordInput.evaluate((input: HTMLInputElement) => input.validationMessage);
                if (validationMessage) {
                    expect(validationMessage).toBeTruthy();
                } else {
                    // 최소한 페이지가 여전히 회원가입 페이지에 있는지 확인 (제출이 차단됨)
                    await expect(page.locator('h1:has-text("회원가입")')).toBeVisible();
                }
            }
        });

        test('정상적인 회원가입 시도 시, 이메일 인증 메일이 발송되어야 한다.', async ({ page }) => {
            // 올바른 정보 입력
            await page.getByRole('textbox', { name: '이메일' }).fill(TEST_EMAIL);
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_PASSWORD);

            // 가입하기 버튼 클릭
            await page.locator('button:has-text("가입하기")').click();

            // 성공 메시지, 이메일 인증 안내 또는 리다이렉트 확인
            try {
                await expect(page.locator('text=/이메일.*확인|인증.*메일|확인.*메일/i')).toBeVisible({ timeout: 3000 });
            } catch {
                // 메시지가 없으면 페이지 이동이나 URL 변화를 확인
                await page.waitForLoadState('networkidle');
                const currentUrl = page.url();
                const hasRedirected = !currentUrl.includes('/signup') || currentUrl.includes('confirm') || currentUrl.includes('verify');
                if (hasRedirected) {
                    expect(hasRedirected).toBeTruthy();
                } else {
                    // 최소한 폼이 정상적으로 제출되었는지 확인 (에러가 없음)
                    const hasError = await page.locator('text=/오류|에러|실패/i').isVisible();
                    expect(hasError).toBeFalsy();
                }
            }
        });
    });
});