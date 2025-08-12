import { test, expect } from '@playwright/test';

test.describe('메인 페이지 UI 확인 및 네비게이션 테스트', () => {
  const BASE_URL = 'http://localhost:3000';

  test.beforeEach(async ({ page }) => await page.goto(BASE_URL));

  test('메인 페이지 로딩 및 UI가 제대로 확인되어야 한다.', async ({ page }) => {
    // 페이지 로딩 시간 측정 시작
    const startTime = Date.now();

    // 페이지 로딩 완료 대기
    await page.waitForLoadState('domcontentloaded');

    // 페이지 로딩 시간 3초 이내여야 통과
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);

    // 페이지 제목
    await expect(page).toHaveTitle('EZBIT');

    // 히어로 섹션
    await expect(page.getByRole('heading', { name: 'EZBIT' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '투자를 재미있고 쉽게' })).toBeVisible();
    await expect(page.getByText('포트폴리오 파일럿이 스마트한 포트폴리오를 추천해드려요')).toBeVisible();

    // 무한 슬라이드
    const coinImages = page.getByRole('img', { name: 'coin logo' });
    await expect(coinImages.first()).toBeVisible();
    expect(await coinImages.count()).toBeGreaterThanOrEqual(22);

    // 시작하기
    await expect(page.getByRole('link', { name: '시작하기' })).toBeVisible();

    // 포트폴리오 옵션 카드
    await expect(page.getByText('라이징 스타')).toBeVisible();
    await expect(page.getByText('베스트 셀러')).toBeVisible();
    await expect(page.getByText('자이언트')).toBeVisible();
  });

  test('시작하기 버튼 클릭 시, 거래소 페이지로 이동해야 한다.', async ({ page }) => {
    // 시작하기 버튼 클릭
    await page.getByRole('link', { name: '시작하기' }).click();

    // 거래소 페이지로 이동 확인
    await expect(page).toHaveURL(`${BASE_URL}/exchange`);
    await expect(page).toHaveTitle('거래소 : EZBIT');

    // 거래소 페이지의 주요 요소 확인
    await expect(page.getByRole('link', { name: '거래소' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '코인명 검색' })).toBeVisible();
  });
});