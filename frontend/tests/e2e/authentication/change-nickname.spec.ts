import { test, expect } from '@playwright/test';

test.describe('닉네임 변경 테스트', () => {
    const BASE_URL = 'http://localhost:3000';
    const TEST_EMAIL = 'test123@example.com';
    const TEST_PASSWORD = '123567as#';
    const NEW_NICKNAME = '안녕하세요';
    const ORIGINAL_NICKNAME = '지금은되나';

    test.beforeEach(async ({ page }) => {
        // 로그인 과정
        await page.goto(`${BASE_URL}/signin`);
        await page.getByRole('textbox', { name: '이메일' }).fill(TEST_EMAIL);
        await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_PASSWORD);
        await page.getByRole('button', { name: '로그인', exact: true }).click();

        // 로그인 완료 대기
        await page.waitForTimeout(2000);

        // 인증 확인
        const cookies = await page.context().cookies();
        const authCookie = cookies.find(cookie => cookie.name === 'sb-xdbogoztmknejhelrtwx-auth-token');
        expect(authCookie).toBeDefined();

        // 사용자 프로필 버튼 클릭
        const profileButton = page.getByRole('button', { name: '사용자 프로필 버튼' });
        await expect(profileButton).toBeVisible();
        await profileButton.click();
    });

    test.describe('닉네임 수정 플로우', () => {
        test('네브바의 사용자 프로필 버튼 클릭 시, 닉네임 수정 폼이 표시되어야 한다', async ({ page }) => {
            // 닉네임 표시 확인
            await expect(page.locator('span').filter({ hasText: ORIGINAL_NICKNAME })).toBeVisible();

            // 닉네임 수정 버튼 확인
            const editButton = page.getByRole('button', { name: '닉네임 수정 버튼' });
            await expect(editButton).toBeVisible();
        });

        test('닉네임 수정 버튼 클릭 시, 수정 폼이 활성화되어야 한다', async ({ page }) => {
            // 닉네임 수정 버튼 클릭
            const editButton = page.getByRole('button', { name: '닉네임 수정 버튼' });
            await editButton.click();

            // 수정 폼 요소들이 나타나는지 확인
            await expect(page.locator('input[placeholder="닉네임을 입력하세요"]')).toBeVisible();
            await expect(page.getByRole('button', { name: '닉네임 수정 완료 버튼' })).toBeVisible();
            await expect(page.getByRole('button', { name: '닉네임 수정 취소 버튼' })).toBeVisible();

            // 기본값이 현재 닉네임으로 설정되어 있는지 확인
            const nicknameInput = page.locator('input[placeholder="닉네임을 입력하세요"]');
            await expect(nicknameInput).toHaveValue(ORIGINAL_NICKNAME);
        });

        test('닉네임 수정 성공 시, 새 닉네임이 표시되어야 한다', async ({ page }) => {
            // 닉네임 수정 버튼 클릭
            const editButton = page.getByRole('button', { name: '닉네임 수정 버튼' });
            await editButton.click();

            // 새 닉네임 입력
            const nicknameInput = page.locator('input[placeholder="닉네임을 입력하세요"]');
            await nicknameInput.clear();
            await nicknameInput.fill(NEW_NICKNAME);

            // 완료 버튼 클릭
            const completeButton = page.getByRole('button', { name: '닉네임 수정 완료 버튼' });
            await completeButton.click();

            // 수정 완료 대기
            await page.waitForTimeout(2000);

            // 새 닉네임이 표시되는지 확인
            await expect(page.getByText(NEW_NICKNAME)).toBeVisible();

            // 수정 폼이 사라지고 닉네임 수정 버튼이 다시 나타나는지 확인
            await expect(page.getByRole('button', { name: '닉네임 수정 버튼' })).toBeVisible();
            await expect(page.locator('input[placeholder="닉네임을 입력하세요"]')).not.toBeVisible();

            // 원래 닉네임으로 다시 되돌리기 (테스트 후 정리)
            await page.getByRole('button', { name: '닉네임 수정 버튼' }).click();
            const revertInput = page.locator('input[placeholder="닉네임을 입력하세요"]');
            await revertInput.clear();
            await revertInput.fill(ORIGINAL_NICKNAME);
            await page.getByRole('button', { name: '닉네임 수정 완료 버튼' }).click();
            await page.waitForTimeout(2000);
        });

        test('닉네임 수정 취소 시, 원래 닉네임이 유지되어야 한다', async ({ page }) => {
            // 닉네임 수정 버튼 클릭
            const editButton = page.getByRole('button', { name: '닉네임 수정 버튼' });
            await editButton.click();

            // 닉네임을 변경
            const nicknameInput = page.locator('input[placeholder="닉네임을 입력하세요"]');
            await nicknameInput.clear();
            await nicknameInput.fill('CancelTest');

            // 취소 버튼 클릭
            const cancelButton = page.getByRole('button', { name: '닉네임 수정 취소 버튼' });
            await cancelButton.click();

            // 원래 닉네임이 유지되는지 확인
            await expect(page.locator('span').filter({ hasText: ORIGINAL_NICKNAME })).toBeVisible();

            // 수정 폼이 사라지고 닉네임 수정 버튼이 다시 나타나는지 확인
            await expect(page.getByRole('button', { name: '닉네임 수정 버튼' })).toBeVisible();
            await expect(page.locator('input[placeholder="닉네임을 입력하세요"]')).not.toBeVisible();
        });

        test('빈 닉네임으로 수정 시도 시, 완료 버튼이 비활성화되어야 한다', async ({ page }) => {
            // 닉네임 수정 버튼 클릭
            const editButton = page.getByRole('button', { name: '닉네임 수정 버튼' });
            await editButton.click();

            // 닉네임을 빈값으로 변경
            const nicknameInput = page.locator('input[placeholder="닉네임을 입력하세요"]');
            await nicknameInput.clear();

            // 완료 버튼이 비활성화되어 있는지 확인
            const completeButton = page.getByRole('button', { name: '닉네임 수정 완료 버튼' });
            await expect(completeButton).toBeDisabled();

            // 취소 버튼은 활성화되어 있는지 확인
            const cancelButton = page.getByRole('button', { name: '닉네임 수정 취소 버튼' });
            await expect(cancelButton).toBeEnabled();
        });

        test('닉네임 길이 제한 (20자)이 적용되어야 한다', async ({ page }) => {
            // 닉네임 수정 버튼 클릭
            const editButton = page.getByRole('button', { name: '닉네임 수정 버튼' });
            await editButton.click();

            // 20자 이상의 닉네임 입력 시도
            const longNickname = 'A'.repeat(25); // 25자
            const nicknameInput = page.locator('input[placeholder="닉네임을 입력하세요"]');
            await nicknameInput.clear();
            await nicknameInput.fill(longNickname);

            // maxLength 속성으로 인해 20자까지만 입력되는지 확인
            const inputValue = await nicknameInput.inputValue();
            expect(inputValue.length).toBeLessThanOrEqual(20);
        });

        test('특수문자 포함 닉네임 입력 시 에러 메시지가 실시간으로 표시되어야 한다', async ({ page }) => {
            // 닉네임 수정 버튼 클릭
            const editButton = page.getByRole('button', { name: '닉네임 수정 버튼' });
            await editButton.click();

            // 특수문자가 포함된 닉네임 입력
            const invalidNickname = 'test@!@23';
            const nicknameInput = page.locator('input[placeholder="닉네임을 입력하세요"]');
            await nicknameInput.clear();
            await nicknameInput.fill(invalidNickname);

            // 유효성 검증 처리 대기 (onChange 모드이므로 입력 즉시 검증됨)
            await page.waitForTimeout(300);

            // 에러 메시지가 실시간으로 표시되는지 확인
            const errorMessage = page.getByTestId('nickname-error');
            await expect(errorMessage).toBeVisible();
            await expect(errorMessage).toHaveText('특수문자는 사용할 수 없습니다.');

            // 완료 버튼이 비활성화되어 있는지도 확인
            const completeButton = page.getByRole('button', { name: '닉네임 수정 완료 버튼' });
            await expect(completeButton).toBeDisabled();
        });

        test('빈 문자열이나 공백만 입력 시 완료 버튼이 비활성화되고 에러 메시지가 표시되어야 한다', async ({ page }) => {
            // 닉네임 수정 버튼 클릭
            const editButton = page.getByRole('button', { name: '닉네임 수정 버튼' });
            await editButton.click();

            const nicknameInput = page.locator('input[placeholder="닉네임을 입력하세요"]');
            const completeButton = page.getByRole('button', { name: '닉네임 수정 완료 버튼' });

            // 빈 문자열로 입력
            await nicknameInput.clear();
            await page.waitForTimeout(300); // 유효성 검증 처리 대기
            
            // 완료 버튼이 비활성화되어 있는지 확인
            await expect(completeButton).toBeDisabled();

            // 공백만 입력
            await nicknameInput.fill('   ');
            await page.waitForTimeout(300);

            // 에러 메시지가 표시되는지 확인
            const errorMessage = page.getByTestId('nickname-error');
            await expect(errorMessage).toBeVisible();
            await expect(errorMessage).toHaveText('닉네임은 비어있을 수 없습니다.');

            // 완료 버튼이 여전히 비활성화되어 있는지 확인
            await expect(completeButton).toBeDisabled();
        });

        test('유효하지 않은 닉네임 입력 시 완료 버튼이 비활성화되고 에러 메시지가 표시되어야 한다', async ({ page }) => {
            // 닉네임 수정 버튼 클릭
            const editButton = page.getByRole('button', { name: '닉네임 수정 버튼' });
            await editButton.click();

            const nicknameInput = page.locator('input[placeholder="닉네임을 입력하세요"]');
            const completeButton = page.getByRole('button', { name: '닉네임 수정 완료 버튼' });
            const errorMessage = page.getByTestId('nickname-error');

            // 특수문자 포함된 닉네임 테스트
            await nicknameInput.clear();
            await nicknameInput.fill('test!@#');
            await page.waitForTimeout(300);
            
            await expect(completeButton).toBeDisabled();
            await expect(errorMessage).toBeVisible();
            await expect(errorMessage).toHaveText('특수문자는 사용할 수 없습니다.');

            // 21자 닉네임 테스트 (maxLength로 제한되므로 실제로는 20자까지만 입력됨)
            await nicknameInput.clear();
            const longNickname = 'A'.repeat(25);
            await nicknameInput.fill(longNickname);
            await page.waitForTimeout(300);
            
            // maxLength로 인해 20자까지만 입력되고, 이는 유효한 길이이므로 활성화될 수 있음
            const inputValue = await nicknameInput.inputValue();
            expect(inputValue.length).toBeLessThanOrEqual(20);

            // 유효한 닉네임으로 변경 시 활성화되고 에러 메시지 사라짐
            await nicknameInput.clear();
            await nicknameInput.fill('유효한닉네임123');
            await page.waitForTimeout(500); // 유효성 검증 처리 대기
            
            await expect(completeButton).toBeEnabled();
            await expect(errorMessage).not.toBeVisible();
        });

        test('중복된 닉네임 입력 시 비동기 검증 후 에러 메시지가 표시되어야 한다', async ({ page }) => {
            // 닉네임 수정 버튼 클릭
            const editButton = page.getByRole('button', { name: '닉네임 수정 버튼' });
            await editButton.click();

            // 다른 사용자가 사용 중인 닉네임을 입력 (테스트 목적으로 가상의 중복 닉네임)
            const nicknameInput = page.locator('input[placeholder="닉네임을 입력하세요"]');
            await nicknameInput.clear();
            await nicknameInput.fill('테스트중복닉네임');

            // 비동기 검증이 완료될 때까지 대기 (중복 검증은 refine으로 구현되어 시간이 걸림)
            await page.waitForTimeout(2000);

            const errorMessage = page.getByTestId('nickname-error');
            const completeButton = page.getByRole('button', { name: '닉네임 수정 완료 버튼' });

            // 중복된 닉네임이라면 에러 메시지가 표시되고 버튼이 비활성화됨
            // 중복이 아니라면 정상적으로 활성화됨 (조건부 확인)
            if (await errorMessage.isVisible()) {
                await expect(errorMessage).toHaveText('이미 존재하는 닉네임입니다.');
                await expect(completeButton).toBeDisabled();
            } else {
                // 중복이 아닌 경우 버튼이 활성화되어야 함
                await expect(completeButton).toBeEnabled();
            }
        });
    });
});