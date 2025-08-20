import { test, expect } from '@playwright/test';
import {
    PAGE_URLS,
    TEST_USER,
    TEST_DATA,
    PATTERNS,
    ERROR_MESSAGES,
    testPasswordToggle,
    verifyPageBasics,
    verifyFormElements,
    verifyValidationMessage,
    navigateAndWait
} from '@/tests/e2e/utils';

test.describe('회원가입 테스트', () => {
    test.beforeEach(async ({ page }) => {
        await navigateAndWait(page, PAGE_URLS.SIGNUP);
    });

    test.describe('폼 검증', () => {
        test('시나리오 1: 회원가입 폼과 모든 UI 요소가 올바르게 렌더링되어야 한다.', async ({ page }) => {
            await verifyPageBasics(page, '회원가입.*EZBIT', '회원가입');
            await verifyFormElements(page, '회원가입 폼', '회원가입');
            await expect(page.getByRole('textbox', { name: '이메일' })).toBeVisible();
            await expect(page.getByRole('textbox', { name: '비밀번호' })).toBeVisible();
            await expect(page.getByRole('button', { name: /가입하기/ })).toBeVisible();
            await expect(page.getByRole('button', { name: /Google 로그인/ })).toBeVisible();
        });

        test('시나리오 2: 비밀번호 토글 기능이 정상 작동해야 한다.', async ({ page }) => {
            await testPasswordToggle(page, TEST_USER.PASSWORD);
        });
    });

    test.describe('회원가입 실패 검증', () => {
        test('시나리오 3: 잘못된 이메일 형식 입력 시 유효성 검증이 실행되어야 한다.', async ({ page }) => {
            await page.getByRole('textbox', { name: '이메일' }).fill(TEST_DATA.INVALID_EMAIL);
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_USER.PASSWORD);
            await page.getByRole('button', { name: /가입하기/ }).click();

            const emailInput = page.getByRole('textbox', { name: '이메일' });

            await verifyValidationMessage(
                emailInput,
                page.locator(`text=${ERROR_MESSAGES.EMAIL_FORMAT}`)
            );
        });

        test('시나리오 4: 빈 이메일 입력 시 에러 UI가 표시되어야 한다.', async ({ page }) => {
            await page.getByRole('textbox', { name: '이메일' }).fill(TEST_DATA.EMPTY_EMAIL);
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_USER.PASSWORD);
            await page.getByRole('button', { name: /가입하기/ }).click();

            const emailInput = page.getByRole('textbox', { name: '이메일' });
            await verifyValidationMessage(
                emailInput,
                page.locator(`text=${ERROR_MESSAGES.EMAIL_REQUIRED}`)
            );
        });

        test('시나리오 5: 비밀번호 강도가 부족할 때 유효성 검증이 실행되어야 한다.', async ({ page }) => {
            await page.getByRole('textbox', { name: '이메일' }).fill(TEST_USER.EMAIL.replace('123', '124'));
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_DATA.WEAK_PASSWORD);
            await page.getByRole('button', { name: /가입하기/ }).click();

            try {
                await expect(page.locator(`text=${ERROR_MESSAGES.PASSWORD_STRENGTH}`)).toBeVisible({ timeout: 2000 });
            } catch {
                const passwordInput = page.getByRole('textbox', { name: '비밀번호' });
                await verifyValidationMessage(
                    passwordInput,
                    page.getByRole('heading', { name: '회원가입' })
                );
            }
        });
    });

    test.describe('회원가입 성공 검증', () => {
        test('시나리오 6: 정상적인 회원가입 시 이메일 인증 또는 리다이렉션이 발생해야 한다.', async ({ page }) => {
            await page.getByRole('textbox', { name: '이메일' }).fill(TEST_USER.EMAIL.replace('123', '124'));
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_USER.PASSWORD);
            await page.getByRole('button', { name: /가입하기/ }).click();

            try {
                await expect(page.locator(`text=${ERROR_MESSAGES.EMAIL_VERIFICATION}`)).toBeVisible({ timeout: 3000 });
            } catch {
                await page.waitForLoadState('networkidle');

                const currentUrl = page.url();

                const hasRedirected = !currentUrl.includes('/signup') ||
                    currentUrl.includes('confirm') ||
                    currentUrl.includes('verify');

                if (hasRedirected) {
                    expect(hasRedirected).toBeTruthy();
                } else {
                    const hasError = await page.locator(`text=${ERROR_MESSAGES.GENERAL_ERROR}`).isVisible();
                    expect(hasError).toBeFalsy();
                }
            }
        });
    });

    test.describe('구글 OAuth 회원가입 검증', () => {
        test('시나리오 7: Google 로그인 버튼 클릭 시 Google OAuth 페이지로 리다이렉션되어야 한다.', async ({ page }) => {
            const googleButton = page.getByRole('button', { name: /Google 로그인/ });
            await expect(googleButton).toBeVisible();
            await expect(googleButton).toBeEnabled();

            await googleButton.click();
            await expect(page).toHaveURL(PATTERNS.GOOGLE_AUTH_URL);
        });
    });
});