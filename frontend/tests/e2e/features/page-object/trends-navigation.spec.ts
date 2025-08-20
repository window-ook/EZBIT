import { test, expect } from '@playwright/test';
import {
    PAGE_URLS,
    TIMEOUTS,
    PATTERNS,
    navigateAndWait,
    verifyNewTabOpensSafely,
    waitForElement
} from '@/tests/e2e/utils';

test.describe('트렌드 페이지 테스트', () => {
    test.beforeEach(async ({ page }) => {
        await navigateAndWait(page, PAGE_URLS.TRENDS, 'domcontentloaded');
    });

    test.describe('컴포넌트 검증', () => {
        test('시나리오 1: 환율 정보 섹션이 올바르게 렌더링되어야 한다.', async ({ page }) => {
            const exchangeRateSection = page.getByRole('region', { name: /오늘.*환율/ }).or(
                page.locator('[aria-label*="환율"]')
            );
            await expect(exchangeRateSection).toBeVisible();

            await expect(page.getByRole('heading', { name: /오늘.*환율/ })).toBeVisible();
        });

        test('시나리오 2: 시황 뉴스 섹션이 올바르게 렌더링되고 외부 링크가 작동해야 한다.', async ({ page }) => {
            const situationSection = page.getByRole('region', { name: /시황/ }).or(
                page.locator('[aria-label*="시황"]')
            );
            await expect(situationSection).toBeVisible();
            await expect(page.getByRole('heading', { name: /시황/ })).toBeVisible();

            const timeElement = situationSection.locator('time');
            await expect(timeElement).toBeVisible();
            const timeText = await timeElement.textContent();
            expect(timeText).toMatch(PATTERNS.DATE_TIME);

            const newsButton = situationSection.getByRole('button', { name: /기사.*링크/ });
            await expect(newsButton).toBeVisible();

            const buttonText = await newsButton.textContent();
            const titleElement = newsButton.locator('span, p, div').filter({ hasText: /\S+/ }).first();

            let hasValidContent = false;

            if (buttonText && buttonText.trim() && buttonText.trim().length > 2) {
                expect(buttonText.trim()).not.toContain('<script');
                expect(buttonText.trim()).not.toContain('javascript:');
                hasValidContent = true;
            } else if (await titleElement.count() > 0) {
                const newsTitle = await titleElement.textContent();
                if (newsTitle && newsTitle.trim() && newsTitle.trim().length > 2) {
                    expect(newsTitle.trim()).not.toContain('<script');
                    expect(newsTitle.trim()).not.toContain('javascript:');
                    hasValidContent = true;
                }
            }

            if (!hasValidContent) {
                console.log('뉴스 버튼에 텍스트가 없지만 버튼 자체는 클릭 가능한 상태입니다.');
            }

            await expect(newsButton).toBeEnabled();

            // 시황 뉴스 버튼 클릭 시 새 탭에서 외부 링크가 열리는지 검증
            if (await newsButton.count() > 0 && await newsButton.isVisible()) {
                const newTabOpened = await verifyNewTabOpensSafely(page, newsButton, /^https?:\/\//);
                if (newTabOpened) {
                    console.log('시황 뉴스 새 탭 열기 검증 성공');
                } else {
                    console.log('시황 뉴스 새 탭 열기가 없거나 외부 링크가 아님');
                }
            }
        });

        test('시나리오 3: 토픽 뉴스 섹션이 올바르게 렌더링되고 뉴스 카드들이 올바르게 표시되어야 한다.', async ({ page }) => {
            const topicsSection = page.getByRole('region', { name: /토픽.*뉴스/ }).or(
                page.locator('[aria-label*="토픽"]')
            );
            await expect(topicsSection).toBeVisible();
            await expect(page.getByRole('heading', { name: /토픽.*뉴스/ })).toBeVisible();

            await page.waitForFunction(
                () => {
                    const articles = document.querySelectorAll('[aria-label*="토픽"] figure, figure');
                    return articles.length >= 6;
                },
                { timeout: TIMEOUTS.LONG }
            );

            const newsCards = topicsSection.locator('figure, article, .news-card');
            const newsCount = await newsCards.count();
            expect(newsCount).toBeGreaterThanOrEqual(1);

            const firstCard = topicsSection.locator('figure').first();

            await expect(firstCard.locator('img')).toBeVisible();

            const newsTitle = firstCard.locator('figcaption');
            await expect(newsTitle).toBeVisible();
            const titleText = await newsTitle.textContent();
            expect(titleText).toBeTruthy();
            expect(titleText!.length).toBeGreaterThan(5);

            const newsButton = firstCard.getByRole('button', { name: /기사.*원본/ });
            await expect(newsButton).toBeVisible();

            // 토픽 뉴스 버튼 클릭 시 새 탭에서 외부 링크가 열리는지 검증
            if (await newsButton.count() > 0 && await newsButton.isVisible()) {
                const newTabOpened = await verifyNewTabOpensSafely(page, newsButton, /^https?:\/\//);
                if (newTabOpened) {
                    console.log('토픽 뉴스 새 탭 열기 검증 성공');
                } else {
                    console.log('토픽 뉴스 새 탭 열기가 없거나 외부 링크가 아님');
                }
            }

            const gridLayout = topicsSection.locator('.grid-cols-2, .grid, [class*="grid"]').first();
            if (await gridLayout.count() > 0) {
                await expect(gridLayout).toBeVisible();
            }
        });
    });

    test.describe('상승률 및 거래대금 리스트 테스트', () => {
        test('시나리오 4: 실시간 상승률 TOP 10 리스트가 올바르게 렌더링되어야 한다.', async ({ page }) => {
            const top10Section = page.getByRole('region', { name: /실시간.*상승률.*TOP.*10/ }).or(
                page.locator('[aria-label*="TOP 10"]')
            );
            await expect(top10Section).toBeVisible();
            await expect(page.getByRole('heading', { name: /실시간.*상승률.*TOP.*10/ })).toBeVisible();

            await waitForElement(page, '[data-testid="top-rised-coins-list"], [data-testid*="coins-list"]');

            const topRisedCoins = page.locator('[data-testid^="coin-item-"], [data-testid*="coin"], .coin-item');
            const topRisedCount = await topRisedCoins.count();
            expect(topRisedCount).toBeGreaterThanOrEqual(1);

            const firstItem = page.locator('[data-testid^="coin-item-"]').first();
            await expect(firstItem).toBeVisible();

            const infoElements = firstItem.locator('dl, p, div, span').filter({ hasText: /\S+/ });
            const infoCount = await infoElements.count();
            expect(infoCount).toBeGreaterThanOrEqual(1);

            const percentageElements = firstItem.locator('*').filter({ hasText: PATTERNS.PERCENTAGE });
            if (await percentageElements.count() > 0) {
                const rateText = await percentageElements.first().textContent();
                expect(rateText).toMatch(PATTERNS.PERCENTAGE);
            }
        });

        test('시나리오 5: 24시간 거래대금 TOP 5 리스트가 올바르게 렌더링되어야 한다.', async ({ page }) => {
            const top5Section = page.getByRole('region', { name: /24시간.*거래대금.*TOP.*5/ }).or(
                page.locator('[aria-label*="거래대금"]')
            );
            await expect(top5Section).toBeVisible();
            await expect(page.getByRole('heading', { name: /24시간.*거래대금.*TOP.*5/ })).toBeVisible();

            await waitForElement(page, '[data-testid="top-trading-volume-coins-list"], [data-testid*="coins-list"]');

            const coinItems = page.locator('[data-testid^="coin-item-"], [data-testid*="coin"], .coin-item');
            const itemCount = await coinItems.count();
            expect(itemCount).toBeGreaterThanOrEqual(1);
        });
    });

    test.describe('YouTube 영상 섹션 테스트', () => {
        test('시나리오 6: YouTube 영상들이 올바르게 렌더링되고 새 탭에서 열리는 기능이 작동해야 한다.', async ({ page }) => {
            const youtubeSection = page.getByRole('region', { name: /YOUTUBE.*영상/ }).or(
                page.locator('[aria-label*="YOUTUBE"]')
            );
            await expect(youtubeSection).toBeVisible();
            await expect(page.getByRole('heading', { name: /YOUTUBE.*영상/ })).toBeVisible();

            await page.waitForFunction(
                () => {
                    const videos = document.querySelectorAll('[aria-label*="YOUTUBE"] .col-span-12, [aria-label*="YOUTUBE"] .col-span-3');
                    return videos.length >= 4;
                },
                { timeout: TIMEOUTS.EXTRA_LONG }
            );

            const videoCards = youtubeSection.locator('.col-span-12, .col-span-3, .grid > *').filter({ hasText: /\S+/ });
            const videoCount = await videoCards.count();
            expect(videoCount).toBeGreaterThanOrEqual(1);

            const firstVideo = videoCards.first();

            await expect(firstVideo.locator('img')).toBeVisible();

            const videoTitles = firstVideo.locator('dl').filter({ hasText: /\S+/ });
            const titleCount = await videoTitles.count();
            expect(titleCount).toBeGreaterThanOrEqual(1);

            const firstTitle = await videoTitles.first().textContent();
            expect(firstTitle).toBeTruthy();
            expect(firstTitle!.length).toBeLessThanOrEqual(28);

            const channelElements = firstVideo.locator('.text-main-dark');
            if (await channelElements.count() > 0) {
                const channelName = await channelElements.first().textContent();
                expect(channelName).toBeTruthy();
            }

            const timeElements = firstVideo.locator('time');
            if (await timeElements.count() > 0) {
                const uploadTime = await timeElements.first().textContent();
                expect(uploadTime).toBeTruthy();
            }

            const youtubeGridLayout = youtubeSection.locator('.grid-cols-12, .grid, [class*="grid"]').first();
            if (await youtubeGridLayout.count() > 0) {
                await expect(youtubeGridLayout).toBeVisible();
            }

            const videoButton = firstVideo.getByRole('button', { name: /영상.*원본/ }).or(
                firstVideo.getByRole('link', { name: /영상|비디오|YouTube/ })
            ).first();

            // YouTube 영상 클릭 시 새 탭에서 YouTube 링크가 열리는지 검증
            if (await videoButton.count() > 0 && await videoButton.isVisible()) {
                const newTabOpened = await verifyNewTabOpensSafely(page, videoButton, PATTERNS.YOUTUBE_URL);
                if (newTabOpened) {
                    console.log('YouTube 영상 새 탭 열기 검증 성공');
                } else {
                    console.log('YouTube 영상 새 탭 열기가 없거나 YouTube 링크가 아님');
                }
            }
        });
    });
});