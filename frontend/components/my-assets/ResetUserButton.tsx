'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { resetUser } from '@/actions/supabase/resetUser';

export default function ResetUserButton() {
    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    const handleReset = async () => {
        if (!confirm('정말 초기화하시겠습니까?')) return;

        try {
            await resetUser();
            alert('계정이 초기화되었습니다.');
            router.refresh();
        } catch (e) {
            alert('초기화 실패: ' + (e as Error).message);
        }
    };

    return (
        <button
            aria-label="계정 초기화"
            type="button"
            className="w-[92%] h-full bg-main text-button-text layout-button hover-button"
            onClick={() => startTransition(handleReset)}
            disabled={isPending}
        >
            {isPending ? '초기화 중...' : '계정 초기화'}
        </button>
    );
}