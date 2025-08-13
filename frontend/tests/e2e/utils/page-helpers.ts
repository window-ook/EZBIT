/**
 * 페이지 관련 헬퍼 함수들
 */

import { Page, expect } from '@playwright/test';
import { TIMEOUTS } from './constants';

/**
 * 페이지 로딩을 기다리고 기본적인 검증을 수행합니다.
 * @param page - Playwright Page 객체
 * @param url - 이동할 URL
 * @param waitUntil - 대기 조건 (기본값: 'networkidle')
 */
export async function navigateAndWait(
  page: Page, 
  url: string, 
  waitUntil: 'networkidle' | 'domcontentloaded' | 'load' = 'networkidle'
): Promise<void> {
  await page.goto(url, { 
    timeout: TIMEOUTS.PAGE_LOAD, 
    waitUntil 
  });
}

/**
 * 페이지의 기본 UI 요소들을 검증합니다.
 * @param page - Playwright Page 객체
 * @param expectedTitle - 예상되는 페이지 제목
 * @param expectedHeading - 예상되는 메인 제목
 */
export async function verifyPageBasics(
  page: Page, 
  expectedTitle: string, 
  expectedHeading?: string
): Promise<void> {
  // 페이지 제목 검증
  await expect(page).toHaveTitle(new RegExp(expectedTitle));
  
  // 메인 제목 검증 (제공된 경우)
  if (expectedHeading) {
    await expect(page.getByRole('heading', { name: expectedHeading })).toBeVisible();
  }
}

/**
 * 폼의 기본 요소들을 검증합니다.
 * @param page - Playwright Page 객체
 * @param formLabel - 폼의 aria-label
 * @param formTitle - 폼 제목
 */
export async function verifyFormElements(
  page: Page, 
  formLabel: string, 
  formTitle: string
): Promise<void> {
  await expect(page.locator(`form[aria-label="${formLabel}"]`)).toBeVisible();
  await expect(page.getByRole('heading', { name: formTitle })).toBeVisible();
}

/**
 * 유효성 검증 메시지를 확인합니다.
 * @param page - Playwright Page 객체
 * @param inputElement - 검증할 input 요소
 * @param fallbackElement - 대체 검증 요소 (선택적)
 */
export async function verifyValidationMessage(
  page: Page, 
  inputElement: any, 
  fallbackElement?: any
): Promise<void> {
  const validationMessage = await inputElement.evaluate(
    (input: HTMLInputElement) => input.validationMessage
  );

  if (validationMessage) {
    expect(validationMessage).toBeTruthy();
  } else if (fallbackElement) {
    await expect(fallbackElement).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }
}

/**
 * 테이블의 기본 구조를 검증합니다.
 * @param page - Playwright Page 객체
 * @param expectedTables - 예상되는 테이블 개수
 */
export async function verifyTableStructure(page: Page, expectedTables: number): Promise<void> {
  for (let i = 0; i < expectedTables; i++) {
    await expect(page.locator('table').nth(i)).toBeVisible();
  }
}

/**
 * 리스트 아이템의 개수를 검증합니다.
 * @param page - Playwright Page 객체
 * @param selector - 아이템을 선택하는 CSS 선택자
 * @param minCount - 최소 개수
 * @param maxCount - 최대 개수 (선택적)
 */
export async function verifyListItemCount(
  page: Page, 
  selector: string, 
  minCount: number, 
  maxCount?: number
): Promise<void> {
  const items = page.locator(selector);
  const count = await items.count();
  
  expect(count).toBeGreaterThanOrEqual(minCount);
  if (maxCount) {
    expect(count).toBeLessThanOrEqual(maxCount);
  }
}

/**
 * 새 탭이 열리는 것을 검증합니다.
 * @param page - Playwright Page 객체
 * @param clickElement - 클릭할 요소
 * @param expectedUrlPattern - 새 탭에서 예상되는 URL 패턴
 */
export async function verifyNewTabOpens(
  page: Page, 
  clickElement: any, 
  expectedUrlPattern: RegExp
): Promise<void> {
  const [newTab] = await Promise.all([
    page.context().waitForEvent('page'),
    clickElement.click()
  ]);

  expect(newTab).toBeTruthy();
  await newTab.waitForLoadState();
  
  const newTabUrl = newTab.url();
  expect(newTabUrl).toMatch(expectedUrlPattern);
  
  await newTab.close();
}

/**
 * 이미지의 렌더링을 검증합니다.
 * @param page - Playwright Page 객체
 * @param imageSelector - 이미지 선택자
 */
export async function verifyImageRendering(page: Page, imageSelector: string): Promise<void> {
  const image = page.locator(imageSelector);
  await expect(image).toBeVisible();
  
  const boundingBox = await image.boundingBox();
  expect(boundingBox).toBeTruthy();
  expect(boundingBox!.width).toBeGreaterThan(10);
  expect(boundingBox!.height).toBeGreaterThan(10);
}

/**
 * 요소가 특정 시간 내에 나타나기를 기다립니다.
 * @param page - Playwright Page 객체
 * @param selector - 대기할 요소 선택자
 * @param timeout - 대기 시간 (기본값: TIMEOUTS.MEDIUM)
 */
export async function waitForElement(
  page: Page, 
  selector: string, 
  timeout: number = TIMEOUTS.MEDIUM
): Promise<void> {
  await page.waitForSelector(selector, { timeout });
}