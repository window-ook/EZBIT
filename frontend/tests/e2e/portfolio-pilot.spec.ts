import { test, expect } from '@playwright/test';
import {
    PAGE_URLS,
    SUCCESS_MESSAGES,
    loginUser,
    logoutUser,
    navigateAndWait,
    selectPortfolioOption,
    moveSlider
} from '@/tests/e2e/utils';

test.describe('포트폴리오 파일럿 테스트', () => {
    test.beforeEach(async ({ page }) => {
        // 포트폴리오 파일럿 페이지로 이동
        await navigateAndWait(page, PAGE_URLS.PORTFOLIO_PILOT);
    });

    test.describe('포트폴리오 옵션 선택 테스트', () => {
        test('포트폴리오 옵션 선택 시 해당하는 전략 정보가 올바르게 업데이트되어야 한다', async ({ page }) => {
            // 라이징 스타 옵션 선택
            await selectPortfolioOption(page, '라이징 스타');

            // 라이징 스타 전략 설명 확인
            await expect(page.getByText(/실시간.*상승률.*TOP.*5/i)).toBeVisible();

            // 베스트 셀러 옵션으로 변경
            await selectPortfolioOption(page, '베스트 셀러');

            // 베스트 셀러 전략 설명 확인
            await expect(page.getByText(/24시간.*거래대금.*TOP.*5/i)).toBeVisible();

            // 이전 선택이 해제되었는지 확인
            const risingStarButton = page.getByLabel('라이징 스타 옵션 선택 버튼').or(
                page.getByRole('button').filter({ hasText: '라이징 스타' })
            );
            await expect(risingStarButton).not.toHaveClass(/border-main.*bg-main/);
        });
    });

    test.describe('로그인 사용자 투자 테스트', () => {
        test.beforeEach(async ({ page }) => {
            // 테스트 계정으로 로그인 후 포트폴리오 페이지로 이동
            await loginUser(page);
            await navigateAndWait(page, PAGE_URLS.PORTFOLIO_PILOT);

            // 라이징 스타 옵션 선택
            await selectPortfolioOption(page, '라이징 스타');
        });

        test('슬라이더로 투자 금액 설정 후 포트폴리오 매수가 정상적으로 실행되어야 한다', async ({ page }) => {
            // 슬라이더로 투자 금액 설정 (50% 위치)
            await moveSlider(page, 0.5);

            // 포트폴리오 구성 완료 대기
            await expect(page.getByText(/현재.*종목.*매수.*가능/i)).toBeVisible();

            // 포트폴리오 요약 정보 확인
            const summaryElements = [
                '실제 투자 금액',
                '매수 종목',
                '종목별 평균 분배 비율'
            ];

            for (const element of summaryElements) {
                const summaryElement = page.getByText(element, { exact: true }).or(
                    page.locator(`dt:has-text("${element}")`)
                );
                await expect(summaryElement).toBeVisible();
            }

            // 현재 매수 가능 종목 확인
            await expect(page.getByText(/현재.*종목.*매수.*가능/i)).toBeVisible();

            // 매수 실행 및 확인 다이얼로그 처리
            const dialogPromise = page.waitForEvent('dialog');
            const buyButton = page.getByLabel('포트폴리오 결과 매수 버튼');
            await buyButton.click();

            const dialog = await dialogPromise;
            expect(dialog.message()).toBe(SUCCESS_MESSAGES.PORTFOLIO_BUY_COMPLETED);
            await dialog.accept();
        });
    });

    test.describe('비로그인 사용자 테스트', () => {
        test('비로그인 상태에서 포트폴리오 옵션 선택 시 로그인 안내 메시지가 표시되어야 한다', async ({ page }) => {
            // 쿠키 초기화로 로그아웃 상태 확인
            await logoutUser(page);
            await navigateAndWait(page, PAGE_URLS.PORTFOLIO_PILOT);

            // 라이징 스타 옵션 선택
            await selectPortfolioOption(page, '라이징 스타');

            // 로그인 필요 메시지 확인 (비로그인 시 매수 불가능 안내)
            await expect(page.getByText(/매수.*가능.*종목.*없/i)).toBeVisible({ timeout: 5000 });
        });
    });
});