import { Metadata } from 'next';
import { Bot } from 'lucide-react';
import { getUserData } from '@/actions/supabase/users/getUserData';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import PortfolioPilotContents from '@/components/portfolio-pilot/PortfolioPilotContents';
import PrefetchedHoldingsAndUserData from '@/components/shared/PrefetchedHoldingsAndUserData';

export const metadata: Metadata = {
    title: '포트폴리오 파일럿 : EZBIT',
    description: '포트폴리오 파일럿 페이지입니다.',
    keywords: ['포트폴리오', '추천', 'EZBIT', '투자', '손익', '수익률'],
};

export const dynamic = 'force-dynamic';

export default async function PortfolioPilotPage() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    let holdingKRW = 0;

    if (user) {
        const userData = await getUserData();
        holdingKRW = userData.holding_krw;
    }

    return (
        <main>
            <PrefetchedHoldingsAndUserData>
                <section className="w-full h-full sm:h-[80rem] flex flex-col gap-2">
                    {/* PC */}
                    <section className="hidden p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 md:flex items-center gap-2">
                        <Bot className="size-4 text-pink-400" />
                        <h1 className="text-sm font-semibold text-blue-800">포트폴리오 파일럿이 선택한 옵션으로 포트폴리오를 구성해드려요!</h1>
                    </section>
                    {/* 모바일 */}
                    <section className="md:hidden p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center gap-2">
                        <Bot className="size-4 text-pink-400" />
                        <h1 className="text-center text-sm font-semibold text-blue-800">선택한 옵션으로 포트폴리오를 구성해드려요!</h1>
                    </section>
                    {/* 콘텐츠 */}
                    <PortfolioPilotContents holdingKRW={holdingKRW} />
                </section>
            </PrefetchedHoldingsAndUserData>
        </main>
    );
}