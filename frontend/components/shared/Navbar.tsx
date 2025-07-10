'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { CircleUserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const LINKS = [
    { href: '/exchange', label: '거래소', requireAuth: false },
    { href: '/auto-portfolio', label: '포트폴리오 추천', requireAuth: false },
    { href: '/trends', label: '트렌드', requireAuth: false },
    { href: '/my-assets', label: '보유 자산', requireAuth: true },
    { href: '/history', label: '거래내역', requireAuth: true },
] as const;

export default function Navbar() {
    const [user, setUser] = useState<null | { id: string }>(null);

    const supabase = createBrowserSupabaseClient();

    const pathname = usePathname();

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
        });
        return () => listener?.subscription.unsubscribe();
    }, [supabase]);

    return (
        <nav className="nav-layout bg-main">
            <div className='nav-contents'>
                {/* 왼쪽 */}
                <div className="flex items-center gap-6">
                    {/* 로고 */}
                    <div className='flex items-center gap-2'>
                        <Image
                            src="https://res.cloudinary.com/dbvzbdffi/image/upload/v1751333125/logo_ejvz9u.avif"
                            alt="EZBIT Logo"
                            width={100}
                            height={100}
                            className="size-8 rounded-md"
                        />
                        <h1 className="text-2xl text-white font-bold">EZBIT</h1>
                    </div>
                    {/* 링크 버튼 */}
                    {LINKS.map(link => {
                        const isActive = pathname.includes(link.href);
                        const isDisabled = link.requireAuth && !user;

                        if (isDisabled) {
                            return (
                                <span
                                    key={link.href}
                                    tabIndex={-1}
                                    aria-disabled="true"
                                    className={`flex items-center text-white opacity-50 cursor-not-allowed`}
                                >
                                    {link.label}
                                </span>
                            );
                        }

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center text-white ${isActive ? 'opacity-100' : 'opacity-70'}`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
                {/* 오른쪽 */}
                <div className='flex items-center gap-4'>
                    {user ? (
                        <>
                            <button
                                type="button"
                                onClick={() => supabase.auth.signOut()}
                                className='cursor-pointer'
                            >
                                <span className="text-white font-bold">로그아웃</span>
                            </button>
                            <Link href='/my-profile'>
                                <CircleUserRound className='size-6 text-white' />
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/signin"
                            >
                                <span className="text-white font-bold">로그인</span>
                            </Link>
                            <Link
                                href="/signup"
                            >
                                <span className="text-white font-bold">회원가입</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav >
    );
}