'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { resetUserData } from '@/actions/supabase/users/resetUserData';
import { ALERT_MESSAGE } from '@/constants/messages';

export default function InitializeUserButton() {
    const router = useRouter();

    const [isPending, startTransition] = useTransition();

    const onReset = async () => {
        if (!confirm('정말 초기화하시겠습니까?')) return;

        const result = await resetUserData();

        if (!result.success) {
            alert(ALERT_MESSAGE.INITIALIZE_USER_DATA_FAIL);
            return;
        }

        alert(ALERT_MESSAGE.INITIALIZE_USER_DATA_SUCCESS);
        router.refresh();
    };

    return (
        <button
            type="button"
            aria-label="계정 정보 초기화 버튼"
            data-testid="reset-user-button"
            disabled={isPending}
            onClick={() => startTransition(onReset)}
            className="w-full h-full bg-main hover:brightness-110 text-button-text font-semibold layout-button hover-button"
        >
            {isPending ? '초기화 중...' : '계정 초기화 하기'}
        </button>
    );
}