'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { resetUserData } from '@/actions/supabase/resetUserData';

export default function ResetAssetsButton() {
    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    const handleReset = async () => {
        if (!confirm('정말 자산을 초기화하시겠습니까?')) return;

        try {
            await resetUserData();
            alert('자산이 초기화되었습니다.');
            router.refresh();
        } catch (e) {
            alert('초기화 실패: ' + (e as Error).message);
        }
    };

    return (
        <button
            type="button"
            className="w-[92%] h-full bg-main text-button-text layout-button hover-button"
            onClick={() => startTransition(handleReset)}
            disabled={isPending}
        >
            {isPending ? '초기화 중...' : '자산 초기화'}
        </button>
    );
}