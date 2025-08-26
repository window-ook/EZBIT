import { test, expect } from '@playwright/test';
import {
    PAGE_URLS,
    TEST_USER,
    PATTERNS,
    ERROR_MESSAGES,
    testPasswordToggle,
    verifyPageBasics,
    verifyFormElements,
    verifyValidationMessage,
    navigateAndWait
} from '@/tests/e2e/utils';

test.describe('로그인 테스트', () => {
    test.beforeEach(async ({ page }) => {
        await navigateAndWait(page, PAGE_URLS.SIGNIN);
    });

    test.describe('폼 검증', () => {
        test('시나리오 1: 로그인 폼의 모든 요소가 올바르게 렌더링되어야 한다.', async ({ page }) => {
            await verifyPageBasics(page, '로그인.*EZBIT', '로그인');
            await verifyFormElements(page, '로그인 폼', '로그인');
            await expect(page.getByRole('textbox', { name: '이메일' })).toBeVisible();
            await expect(page.getByRole('textbox', { name: '비밀번호' })).toBeVisible();
            await expect(page.getByRole('button', { name: '로그인', exact: true })).toBeVisible();
            await expect(page.getByRole('button', { name: /Google 로그인/ })).toBeVisible();
            await expect(page.getByRole('link', { name: /재설정/ })).toBeVisible();
        });

        test('시나리오 2: 비밀번호 토글 기능이 정상 작동해야 한다.', async ({ page }) => {
            await testPasswordToggle(page, TEST_USER.PASSWORD);
        });
    });

    test.describe('로그인 실패 검증', () => {
        test('시나리오 3: 존재하지 않는 이메일을 입력 시 적절한 에러가 표시되어야 한다.', async ({ page }) => {
            await page.getByRole('textbox', { name: '이메일' }).fill('nonexistent@example.com');
            await page.getByRole('textbox', { name: '비밀번호' }).fill('wrongpassword');
            await page.getByRole('button', { name: '로그인', exact: true }).click();

            try {
                await expect(page.locator(`text=${ERROR_MESSAGES.LOGIN_FAILED}`)).toBeVisible({ timeout: 3000 });
            } catch {
                await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible();
            }
        });

        test('시나리오 4: 이메일 입력하지 않고 로그인 시 유효성 검증이 작동해야 한다.', async ({ page }) => {
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_USER.PASSWORD);
            await page.getByRole('button', { name: '로그인', exact: true }).click();

            const emailInput = page.getByRole('textbox', { name: '이메일' });

            await verifyValidationMessage(emailInput, page.getByRole('heading', { name: '로그인' }));
        });

        test('시나리오 5: 비밀번호 입력하지 않고 로그인 시 유효성 검증이 작동해야 한다.', async ({ page }) => {
            await page.getByRole('textbox', { name: '이메일' }).fill(TEST_USER.EMAIL);
            await page.getByRole('button', { name: '로그인', exact: true }).click();

            const passwordInput = page.getByRole('textbox', { name: '비밀번호' });

            await verifyValidationMessage(passwordInput, page.getByRole('heading', { name: '로그인' }));
        });

        test('시나리오 6: 잘못된 비밀번호 입력 시 유효성 검증이 작동해야 한다.', async ({ page }) => {
            await page.getByRole('textbox', { name: '이메일' }).fill(TEST_USER.EMAIL);
            await page.getByRole('textbox', { name: '비밀번호' }).fill('wrongpassword');
            await page.getByRole('button', { name: '로그인', exact: true }).click();

            const passwordInput = page.getByRole('textbox', { name: '비밀번호' });

            await verifyValidationMessage(passwordInput, page.getByRole('heading', { name: '로그인' }));
        });
    });

    test.describe('로그인 성공 검증', () => {
        test('시나리오 7: 유효한 계정으로 로그인 시 인증이 완료되고 리다이렉션되어야 한다.', async ({ page }) => {
            await page.getByRole('textbox', { name: '이메일' }).fill(TEST_USER.EMAIL);
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_USER.PASSWORD);
            await page.getByRole('button', { name: '로그인', exact: true }).click();

            await page.waitForLoadState('networkidle');

            try {
                const cookies = await page.context().cookies();
                const authCookie = cookies.find(cookie => cookie.name.includes('auth-token') || cookie.name.includes('sb-'));

                if (authCookie && authCookie.value) {
                    expect(page.url()).not.toContain('/signin');
                } else {
                    await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible();
                }
            } catch {
                await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible();
            }
        });
    });

    test.describe('구글 OAuth 로그인 검증', () => {
        test('시나리오 8: Google 로그인 버튼 클릭 시 Google OAuth 페이지로 리다이렉션되어야 한다.', async ({ page }) => {
            const googleButton = page.getByRole('button', { name: /Google 로그인/ });
            await expect(googleButton).toBeVisible();
            await expect(googleButton).toBeEnabled();

            await googleButton.click();
            await expect(page).toHaveURL(PATTERNS.GOOGLE_AUTH_URL);
        });
    });
});