import { test, expect } from '@playwright/test';

test.describe('비밀번호 재설정 테스트', () => {
    const BASE_URL = 'http://localhost:3000/signin';

    test('비밀번호 재설정 링크 클릭 시, 비밀번호 재설정 페이지로 이동해야 한다.', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.locator('a:has-text("재설정하기")').click();
        await expect(page).toHaveURL(/.*reset-password.*/);
        await expect(page.locator('form[aria-label="이메일 입력 폼"]')).toBeVisible();
        await expect(page.locator('h1:has-text("비밀번호 재설정")')).toBeVisible();
        await expect(page.getByRole('textbox', { name: '이메일' })).toBeVisible();
        await expect(page.getByRole('button', { name: '비밀번호 재설정 링크 메일 요청 버튼' })).toBeVisible();
        await expect(page.getByRole('button', { name: '로그인 페이지로 돌아가기 버튼' })).toBeVisible();
    });
});