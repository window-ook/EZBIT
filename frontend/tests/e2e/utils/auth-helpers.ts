/**
 * 인증 관련 헬퍼 함수들
 */

import { Page, expect } from '@playwright/test';
import { PAGE_URLS, TEST_USER, SUPABASE } from './constants';

/**
 * 테스트 계정으로 로그인을 수행합니다.
 * @param page - Playwright Page 객체
 * @param email - 로그인할 이메일 (기본값: TEST_USER.EMAIL)
 * @param password - 로그인할 비밀번호 (기본값: TEST_USER.PASSWORD)
 */
export async function loginUser(
  page: Page,
  email: string = TEST_USER.EMAIL,
  password: string = TEST_USER.PASSWORD
): Promise<void> {
  console.log(`로그인 시도: ${email}`);

  // 이미 로그인되어 있는지 확인
  const alreadyLoggedIn = await isAuthenticated(page);
  if (alreadyLoggedIn) {
    console.log('이미 로그인되어 있음');
    return;
  }

  // 로그인 페이지로 이동
  await page.goto(PAGE_URLS.SIGNIN, { timeout: 30000 });
  await page.waitForLoadState('domcontentloaded');

  // 로그인 폼 요소들을 실제 DOM 구조에 맞게 찾기
  const emailInput = page.locator('input[type="email"]').or(
    page.getByPlaceholder(/이메일/)
  ).first();

  const passwordInput = page.locator('input[type="password"]').or(
    page.locator('input[id="password"]')
  ).first();

  const loginButton = page.locator('button[type="submit"]').or(
    page.getByRole('button', { name: '로그인' })
  ).or(
    page.locator('button').filter({ hasText: '로그인' })
  ).first();

  // 폼 요소들이 존재하는지 확인
  await expect(emailInput).toBeVisible({ timeout: 10000 });
  await expect(passwordInput).toBeVisible({ timeout: 10000 });
  await expect(loginButton).toBeVisible({ timeout: 10000 });

  // 폼 입력
  await emailInput.clear();
  await emailInput.fill(email);
  await passwordInput.clear();
  await passwordInput.fill(password);

  // 로그인 버튼 클릭
  await loginButton.click();

  // 네트워크 안정화 대기
  await page.waitForLoadState('networkidle', { timeout: 15000 });

  // 추가 대기 (인증 프로세스 완료를 위해)
  await page.waitForTimeout(2000);

  // 인증 상태 확인 (에러 발생 시 throw)
  const isLoggedIn = await isAuthenticated(page);
  if (!isLoggedIn) {
    // 로그인 실패 시 더 구체적인 에러 메시지 확인
    const errorElements = [
      page.locator('[role="alert"]'),
      page.locator('.error'),
      page.locator('.alert-error'),
      page.locator('[data-testid*="error"]'),
      page.locator('p.text-red-600'), // InputField의 에러 메시지
      page.getByText(/이메일.*형식|비밀번호.*틀|로그인.*실패|인증.*실패/)
    ];

    let errorMessage = '로그인 실패';

    // 현재 페이지 URL 확인
    const currentUrl = page.url();
    console.log(`현재 페이지 URL: ${currentUrl}`);

    // 에러 메시지 찾기
    for (const errorElement of errorElements) {
      try {
        if (await errorElement.count() > 0) {
          const errorText = await errorElement.first().textContent();
          if (errorText && errorText.trim()) {
            errorMessage = `로그인 실패: ${errorText.trim()}`;
            break;
          }
        }
      } catch (e) {
        // 에러 요소 접근 중 오류 무시
      }
    }

    // 추가: 페이지 타이틀로도 상황 파악
    const pageTitle = await page.title();
    if (pageTitle.includes('로그인')) {
      errorMessage += ' (여전히 로그인 페이지에 있음)';
    }

    console.log('로그인 실패:', errorMessage);
    throw new Error(errorMessage);
  }

  console.log('로그인 성공');
}

/**
 * 사용자 프로필 드롭다운을 열고 프로필 페이지에 접근합니다.
 * @param page - Playwright Page 객체
 */
export async function openUserProfile(page: Page): Promise<void> {
  // 페이지가 완전히 로드될 때까지 대기
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  console.log('프로필 버튼 찾는 중...');
  
  // CircleUserRound 아이콘이 있는 버튼 찾기 (네비바의 실제 구조)
  const profileButton = page.locator('button[aria-label="사용자 프로필 버튼"]')
    .or(page.locator('button').filter({ has: page.locator('svg') }).first());
  
  // 버튼이 보이는지 확인
  await expect(profileButton).toBeVisible({ timeout: 15000 });
  
  console.log('프로필 버튼 발견, 클릭 시도...');
  await profileButton.click();
  
  // 드롭다운 메뉴가 열릴 때까지 대기
  await page.waitForTimeout(1000);
  
  // 드롭다운 컨텐츠가 나타났는지 확인
  const dropdownContent = page.locator('[role="menu"]').or(
    page.locator('[data-radix-dropdown-content]')
  );
  
  await expect(dropdownContent).toBeVisible({ timeout: 5000 });
  console.log('프로필 드롭다운 열기 완료');
}

/**
 * 로그아웃 상태로 만듭니다 (쿠키 초기화).
 * @param page - Playwright Page 객체
 */
export async function logoutUser(page: Page): Promise<void> {
  await page.context().clearCookies();
}

/**
 * 인증 상태를 확인합니다.
 * @param page - Playwright Page 객체
 * @returns 인증된 상태인지 여부
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    // 페이지가 로딩될 때까지 잠시 대기
    await page.waitForLoadState('domcontentloaded');

    // 1. 쿠키 기반 인증 확인 (가장 신뢰성 높음)
    const cookies = await page.context().cookies();
    const authCookie = cookies.find(cookie =>
      cookie.name === SUPABASE.AUTH_COOKIE_NAME ||
      cookie.name.includes('auth-token') ||
      cookie.name.includes('supabase')
    );

    if (authCookie && authCookie.value && authCookie.value.length > 10) {
      console.log('인증 쿠키 발견:', authCookie.name);
      return true;
    }

    // 2. UI 기반 인증 상태 확인 (여러 방식으로)
    const authIndicators = [
      page.locator('[data-testid="user-profile"]'),
      page.locator('[data-testid="profile-button"]'),
      page.getByText('로그아웃'),
      page.getByRole('button', { name: /프로필|사용자/ }),
      page.locator('.user-profile'),
      page.locator('[aria-label*="프로필"]'),
      page.locator('[aria-label*="사용자"]')
    ];

    // 인증 상태를 나타내는 요소 중 하나라도 존재하면 로그인 상태
    for (const indicator of authIndicators) {
      if (await indicator.count() > 0) {
        console.log('인증 UI 요소 발견');
        return true;
      }
    }

    // 3. 로그인 버튼의 부재로 확인
    const loginButtons = [
      page.getByText('로그인', { exact: true }),
      page.getByRole('button', { name: /로그인/ }),
      page.getByRole('link', { name: /로그인/ })
    ];

    let hasLoginButton = false;
    for (const button of loginButtons) {
      if (await button.count() > 0) {
        hasLoginButton = true;
        break;
      }
    }

    // 로그인 버튼이 없으면 로그인된 상태일 가능성
    const result = !hasLoginButton;
    console.log(`인증 상태 확인 결과: ${result ? '로그인됨' : '비로그인'}`);
    return result;

  } catch (error) {
    console.log('인증 상태 확인 중 오류:', error);
    return false;
  }
}

/**
 * 비밀번호 토글 기능을 테스트합니다.
 * @param page - Playwright Page 객체
 * @param testPassword - 테스트할 비밀번호
 */
export async function testPasswordToggle(page: Page, testPassword: string): Promise<void> {
  const passwordInput = page.getByRole('textbox', { name: '비밀번호' });
  const toggleButton = page.locator('button:has(img[alt*="비밀번호"])');

  // 비밀번호 입력
  await passwordInput.fill(testPassword);

  // 토글 버튼 확인
  await expect(toggleButton).toBeVisible();

  // 현재 상태 확인 후 토글 테스트
  const initialType = await passwordInput.getAttribute('type');
  if (initialType === 'password') {
    // 보기 상태로 변경
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // 다시 숨기기 상태로 변경
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  }
}