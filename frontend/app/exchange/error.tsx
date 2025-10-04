'use client';

import { useEffect } from 'react';
import { CONSOLE_ERROR } from '@/constants/messages';
import { Card } from '@/components/shadcn-ui/card';
import Button from '@/components/shared/Button';

export default function ExchangeError({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
    useEffect(() => {
        console.error(CONSOLE_ERROR.EXCHANGE_PAGE_LOAD_FAIL, error);
    }, [error]);

    return (
        <main className="h-full flex flex-col gap-2">
            <Card className="w-full h-[10rem] flex flex-col items-center justify-center gap-4 p-4">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-negative mb-2">거래소 로딩 중 오류가 발생했습니다</h2>
                    <p className="text-sm text-description">{error.message || '알 수 없는 오류'}</p>
                </div>
            </Card>

            <Card className="w-full h-[400px] flex items-center justify-center">
                <div className="text-center text-description">
                    차트를 불러올 수 없습니다
                </div>
            </Card>

            <section className="flex flex-col md:flex-row justify-center gap-2">
                <Card className="w-full h-[26rem] flex items-center justify-center">
                    <div className="text-center text-description">
                        오더북을 불러올 수 없습니다
                    </div>
                </Card>
                <Card className="w-full h-[26rem] flex flex-col items-center justify-center gap-4 p-4">
                    <div className="text-center text-description mb-4">
                        주문을 진행할 수 없습니다
                    </div>
                    <Button
                        onClick={reset}
                        customClassName="bg-main hover:bg-main/90 text-white px-6 py-2"
                    >
                        다시 시도
                    </Button>

                </Card>
            </section>

            <section className="flex-1 overflow-y-auto flex justify-center">
                <Card className="w-full flex items-center justify-center">
                    <div className="text-center text-description">
                        체결 내역을 불러올 수 없습니다
                    </div>
                </Card>
            </section>
        </main>
    );
}