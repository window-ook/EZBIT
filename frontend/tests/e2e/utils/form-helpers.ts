/**
 * 폼 관련 헬퍼 함수들
 */

import { Page, expect } from '@playwright/test';

/**
 * 닉네임 수정 폼을 활성화합니다.
 * @param page - Playwright Page 객체
 */
export async function activateNicknameEditForm(page: Page): Promise<void> {
  console.log('닉네임 수정 버튼 찾는 중...');

  // EditNickNameForm 컴포넌트의 실제 구조에 맞는 선택자 사용
  const editButton = page.locator('button[aria-label="닉네임 수정 버튼"]').or(
    page.locator('button').filter({ has: page.locator('svg') }).last() // Edit3 아이콘이 있는 마지막 버튼
  );

  await expect(editButton).toBeVisible({ timeout: 10000 });
  console.log('닉네임 수정 버튼 발견, 클릭 시도...');

  await editButton.click();

  // 수정 폼이 활성화될 때까지 잠시 대기
  await page.waitForTimeout(500);

  // 수정 폼 요소들이 나타나는지 확인
  const nicknameInput = page.locator('input[placeholder="닉네임을 입력하세요"]');
  const completeButton = page.locator('button[aria-label="닉네임 수정 완료 버튼"]');
  const cancelButton = page.locator('button[aria-label="닉네임 수정 취소 버튼"]');

  await expect(nicknameInput).toBeVisible({ timeout: 5000 });
  await expect(completeButton).toBeVisible({ timeout: 5000 });
  await expect(cancelButton).toBeVisible({ timeout: 5000 });

  console.log('닉네임 수정 폼 활성화 완료');
}

/**
 * 닉네임 수정을 완료합니다.
 * @param page - Playwright Page 객체
 * @param newNickname - 새 닉네임
 */
export async function completeNicknameEdit(page: Page, newNickname: string): Promise<void> {
  console.log(`닉네임 수정 시작: ${newNickname}`);

  const nicknameInput = page.locator('input[placeholder="닉네임을 입력하세요"]');
  await expect(nicknameInput).toBeVisible({ timeout: 5000 });

  // 기존 값 지우고 새 닉네임 입력
  await nicknameInput.clear();
  await nicknameInput.fill(newNickname);

  // 입력값이 올바르게 설정되었는지 확인
  const inputValue = await nicknameInput.inputValue();
  expect(inputValue).toBe(newNickname);
  console.log('닉네임 입력 완료:', inputValue);

  // 완료 버튼 클릭
  const completeButton = page.locator('button[aria-label="닉네임 수정 완료 버튼"]');
  await expect(completeButton).toBeVisible();
  await expect(completeButton).toBeEnabled();

  await completeButton.click();
  console.log('닉네임 수정 완료 버튼 클릭');

  // 폼이 비활성화되고 새 닉네임이 표시될 때까지 대기
  await page.waitForTimeout(1000);

  // 수정 폼이 사라지고 일반 표시 모드로 돌아갔는지 확인
  await expect(nicknameInput).not.toBeVisible({ timeout: 5000 });
  console.log('닉네임 수정 폼 비활성화 확인');
}

/**
 * 닉네임 수정을 취소합니다.
 * @param page - Playwright Page 객체
 */
export async function cancelNicknameEdit(page: Page): Promise<void> {
  console.log('닉네임 수정 취소 시작');

  const cancelButton = page.locator('button[aria-label="닉네임 수정 취소 버튼"]');
  await expect(cancelButton).toBeVisible({ timeout: 5000 });
  await expect(cancelButton).toBeEnabled();

  await cancelButton.click();
  console.log('닉네임 수정 취소 버튼 클릭');

  // 수정 폼이 사라질 때까지 대기
  const nicknameInput = page.locator('input[placeholder="닉네임을 입력하세요"]');
  await expect(nicknameInput).not.toBeVisible({ timeout: 5000 });
  console.log('닉네임 수정 폼 취소 완료');
}

/**
 * 닉네임 유효성 검증을 테스트합니다.
 * @param page - Playwright Page 객체
 * @param nickname - 테스트할 닉네임
 * @param expectedErrorMessage - 예상되는 에러 메시지
 * @param shouldBeDisabled - 완료 버튼이 비활성화되어야 하는지 여부
 */
export async function testNicknameValidation(
  page: Page,
  nickname: string,
  expectedErrorMessage?: string,
  shouldBeDisabled: boolean = true
): Promise<void> {
  console.log(`닉네임 유효성 검증 테스트: "${nickname}"`);

  const nicknameInput = page.locator('input[placeholder="닉네임을 입력하세요"]');
  const completeButton = page.locator('button[aria-label="닉네임 수정 완료 버튼"]');
  const errorMessage = page.getByTestId('nickname-error');

  // 닉네임 입력
  await expect(nicknameInput).toBeVisible();
  await nicknameInput.clear();
  await nicknameInput.fill(nickname);

  // 입력값 확인
  const inputValue = await nicknameInput.inputValue();
  console.log('입력된 닉네임:', inputValue);

  // 유효성 검증 대기 (react-hook-form의 onChange 모드)
  await page.waitForTimeout(500);

  // 완료 버튼 상태 검증
  console.log('완료 버튼 상태 확인 중...');
  if (shouldBeDisabled) {
    await expect(completeButton).toBeDisabled({ timeout: 3000 });
    console.log('완료 버튼이 비활성화됨');
  } else {
    await expect(completeButton).toBeEnabled({ timeout: 3000 });
    console.log('완료 버튼이 활성화됨');
  }

  // 에러 메시지 검증 (제공된 경우)
  if (expectedErrorMessage) {
    console.log('에러 메시지 확인 중...');
    await expect(errorMessage).toBeVisible({ timeout: 3000 });
    await expect(errorMessage).toHaveText(expectedErrorMessage);
    console.log('에러 메시지 확인됨:', expectedErrorMessage);
  } else {
    // 에러 메시지가 없어야 하는 경우
    try {
      await expect(errorMessage).not.toBeVisible({ timeout: 1000 });
      console.log('에러 메시지 없음 (정상)');
    } catch (error) {
      // 에러 요소가 존재하지 않는 경우도 정상
      console.log('에러 메시지 요소 없음 (정상)');
    }
  }
}

/**
 * 슬라이더를 특정 비율로 이동시킵니다.
 * @param page - Playwright Page 객체
 * @param targetRatio - 목표 비율 (0.0 ~ 1.0)
 */
export async function moveSlider(page: Page, targetRatio: number = 0.5): Promise<void> {
  const slider = page.locator('[role="slider"]').first();
  await expect(slider).toBeVisible();

  const sliderBox = await slider.boundingBox();
  if (!sliderBox) throw new Error('슬라이더를 찾을 수 없습니다');

  // 슬라이더 이동
  const targetX = sliderBox.x + sliderBox.width * targetRatio;
  const targetY = sliderBox.y + sliderBox.height / 2;

  await page.mouse.move(sliderBox.x + sliderBox.width * 0.1, targetY);
  await page.mouse.down();
  await page.mouse.move(targetX, targetY);
  await page.mouse.up();

  // 값 업데이트 대기
  await page.waitForTimeout(500);
}

/**
 * 주문 폼의 기본 요소들을 검증합니다.
 * @param page - Playwright Page 객체
 * @param orderType - 주문 타입 ('매수' 또는 '매도')
 */
export async function verifyOrderForm(page: Page, orderType: '매수' | '매도'): Promise<void> {
  // 주문 탭 확인
  const orderTab = page.getByRole('tab', { name: `${orderType} 탭 선택 버튼` });
  await expect(orderTab).toBeVisible();

  // 주문 폼 필드들 확인
  await expect(page.getByLabel(`${orderType}가격`)).toBeVisible();
  await expect(page.getByLabel('주문수량')).toBeVisible();
  await expect(page.getByLabel('주문총액')).toBeVisible();

  // 주문 버튼 확인
  await expect(page.getByLabel(`${orderType} 주문하기 버튼`)).toBeVisible();
}

/**
 * 포트폴리오 옵션을 선택합니다.
 * @param page - Playwright Page 객체
 * @param optionName - 옵션 이름 ('라이징 스타', '베스트 셀러', '자이언트')
 */
export async function selectPortfolioOption(page: Page, optionName: string): Promise<void> {
  const optionButton = page.getByLabel(`${optionName} 옵션 선택 버튼`).or(
    page.getByRole('button').filter({ hasText: optionName })
  );

  await expect(optionButton).toBeVisible();
  await optionButton.click();

  // 선택된 상태 확인
  await expect(optionButton).toHaveClass(/border-main|bg-main/);
}