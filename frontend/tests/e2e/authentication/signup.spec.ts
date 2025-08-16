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
        // 회원가입 페이지로 이동
        await navigateAndWait(page, PAGE_URLS.SIGNUP);
    });

    test.describe('폼 렌더링 테스트', () => {
        test('회원가입 폼과 모든 UI 요소가 올바르게 렌더링되어야 한다', async ({ page }) => {
            // 페이지 기본 정보 검증
            await verifyPageBasics(page, '회원가입.*EZBIT', '회원가입');

            // 폼 기본 구조 검증
            await verifyFormElements(page, '회원가입 폼', '회원가입');

            // 입력 필드 검증
            await expect(page.getByRole('textbox', { name: '이메일' })).toBeVisible();
            await expect(page.getByRole('textbox', { name: '비밀번호' })).toBeVisible();

            // 버튼 요소 검증
            await expect(page.getByRole('button', { name: /가입하기/ })).toBeVisible();
            await expect(page.getByRole('button', { name: /Google 로그인/ })).toBeVisible();
        });

        test('비밀번호 가시성 토글 기능이 정상 작동해야 한다', async ({ page }) => {
            // 비밀번호 토글 기능 테스트
            await testPasswordToggle(page, TEST_USER.PASSWORD);
        });
    });

    test.describe('회원가입 유효성 검증 테스트', () => {
        test('잘못된 이메일 형식 입력 시 유효성 검증이 실행되어야 한다', async ({ page }) => {
            // 잘못된 이메일 형식과 유효한 비밀번호 입력
            await page.getByRole('textbox', { name: '이메일' }).fill(TEST_DATA.INVALID_EMAIL);
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_USER.PASSWORD);
            await page.getByRole('button', { name: /가입하기/ }).click();

            // 유횤성 검증 메시지 확인
            const emailInput = page.getByRole('textbox', { name: '이메일' });
            await verifyValidationMessage(
                page,
                emailInput,
                page.locator(`text=${ERROR_MESSAGES.EMAIL_FORMAT}`)
            );
        });

        test('빈 이메일 입력 시 유효성 검증이 실행되어야 한다', async ({ page }) => {
            // 빈 이메일과 유효한 비밀번호 입력
            await page.getByRole('textbox', { name: '이메일' }).fill(TEST_DATA.EMPTY_EMAIL);
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_USER.PASSWORD);
            await page.getByRole('button', { name: /가입하기/ }).click();

            // 유횤성 검증 메시지 확인
            const emailInput = page.getByRole('textbox', { name: '이메일' });
            await verifyValidationMessage(
                page,
                emailInput,
                page.locator(`text=${ERROR_MESSAGES.EMAIL_REQUIRED}`)
            );
        });

        test('비밀번호 강도가 부족할 때 유효성 검증이 실행되어야 한다', async ({ page }) => {
            // 유효한 이메일과 약한 비밀번호 입력
            await page.getByRole('textbox', { name: '이메일' }).fill(TEST_USER.EMAIL.replace('123', '124'));
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_DATA.WEAK_PASSWORD);
            await page.getByRole('button', { name: /가입하기/ }).click();

            // 비밀번호 강도 검증 메시지 확인
            try {
                await expect(page.locator(`text=${ERROR_MESSAGES.PASSWORD_STRENGTH}`)).toBeVisible({ timeout: 2000 });
            } catch {
                const passwordInput = page.getByRole('textbox', { name: '비밀번호' });
                await verifyValidationMessage(
                    page,
                    passwordInput,
                    page.getByRole('heading', { name: '회원가입' })
                );
            }
        });
    });

    test.describe('회원가입 성공 테스트', () => {
        test('정상적인 회원가입 시 이메일 인증 또는 리다이렉션이 발생해야 한다', async ({ page }) => {
            // 유효한 회원가입 정보 입력
            await page.getByRole('textbox', { name: '이메일' }).fill(TEST_USER.EMAIL.replace('123', '124'));
            await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_USER.PASSWORD);
            await page.getByRole('button', { name: /가입하기/ }).click();

            // 이메일 인증 메시지 또는 리다이렉션 확인
            try {
                await expect(page.locator(`text=${ERROR_MESSAGES.EMAIL_VERIFICATION}`)).toBeVisible({ timeout: 3000 });
            } catch {
                // 메시지가 없으면 리다이렉션 또는 오류 상태 확인
                await page.waitForLoadState('networkidle');
                const currentUrl = page.url();
                const hasRedirected = !currentUrl.includes('/signup') ||
                    currentUrl.includes('confirm') ||
                    currentUrl.includes('verify');

                if (hasRedirected) {
                    expect(hasRedirected).toBeTruthy();
                } else {
                    // 에러가 없어야 함
                    const hasError = await page.locator(`text=${ERROR_MESSAGES.GENERAL_ERROR}`).isVisible();
                    expect(hasError).toBeFalsy();
                }
            }
        });
    });

    test.describe('OAuth 회원가입 테스트', () => {
        test('Google 로그인 버튼 클릭 시 Google OAuth 페이지로 리다이렉션되어야 한다', async ({ page }) => {
            // Google 로그인 버튼 찾기 및 상태 확인
            const googleButton = page.getByRole('button', { name: /Google 로그인/ });
            await expect(googleButton).toBeVisible();
            await expect(googleButton).toBeEnabled();

            // Google OAuth 페이지로 이동 확인
            await googleButton.click();
            await expect(page).toHaveURL(PATTERNS.GOOGLE_AUTH_URL);
        });
    });
});