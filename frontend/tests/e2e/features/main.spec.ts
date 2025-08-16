import { test, expect } from '@playwright/test';
import {
    PAGE_URLS,
    navigateAndWait,
    verifyPageBasics
} from '@/tests/e2e/utils';

test.describe('메인 페이지 테스트', () => {
    test.beforeEach(async ({ page }) => {
        // 메인 페이지로 이동
        await navigateAndWait(page, PAGE_URLS.HOME);
    });

    test.describe('메인 페이지 UI 렌더링 테스트', () => {
        test('메인 페이지가 올바르게 로딩되고 모든 주요 UI 요소가 표시되어야 한다', async ({ page }) => {
            // 페이지 로딩 시간 성능 테스트
            const startTime = Date.now();
            await page.waitForLoadState('domcontentloaded');
            const loadTime = Date.now() - startTime;
            expect(loadTime).toBeLessThan(3000); // 3초 이내 로딩

            // 페이지 기본 정보 검증
            await verifyPageBasics(page, 'EZBIT');

            // 히어로 섹션 주요 요소들 확인
            await expect(page.getByRole('heading', { name: 'EZBIT' })).toBeVisible();
            await expect(page.getByRole('heading', { name: /투자를.*재미있고.*쉽게/ })).toBeVisible();
            await expect(page.getByText(/포트폴리오.*파일럿.*스마트한.*포트폴리오.*추천/)).toBeVisible();

            // 무한 슬라이드 코인 이미지들 확인
            const coinImages = page.getByRole('img', { name: /coin.*logo/i });
            await expect(coinImages.first()).toBeVisible();

            // 코인 이미지 개수 확인 (최소 22개)
            const imageCount = await coinImages.count();
            expect(imageCount).toBeGreaterThanOrEqual(22);

            // 시작하기 버튼 확인
            await expect(page.getByRole('link', { name: /시작하기/ })).toBeVisible();

            // 포트폴리오 옵션 카드들 확인
            const portfolioOptions = ['라이징 스타', '베스트 셀러', '자이언트'];
            for (const option of portfolioOptions) {
                await expect(page.getByText(option)).toBeVisible();
            }
        });
    });

    test.describe('내비게이션 테스트', () => {
        test('시작하기 버튼 클릭 시 거래소 페이지로 올바르게 이동해야 한다', async ({ page }) => {
            // 시작하기 버튼 클릭
            const startButton = page.getByRole('link', { name: /시작하기/ });
            await expect(startButton).toBeVisible();
            await startButton.click();

            // 거래소 페이지로 리다이렉션 확인
            await expect(page).toHaveURL(PAGE_URLS.EXCHANGE);
            await expect(page).toHaveTitle(/거래소.*EZBIT/);

            // 거래소 페이지 주요 요소 확인
            await expect(page.getByRole('link', { name: /거래소/ })).toBeVisible();
            await expect(page.getByRole('textbox', { name: /코인명.*검색/ })).toBeVisible();
        });
    });
});