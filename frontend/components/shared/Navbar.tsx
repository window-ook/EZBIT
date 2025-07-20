'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUserForDropdown } from '@/hooks/supabase/useUser';
import { ErrorBoundary } from 'react-error-boundary';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/shadcn-ui/dropdown-menu';
import { CircleUserRound, LogOut, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import EditDisplayNameForm from '@/components/shared/EditDisplayNameForm';

const LINKS = [
    { href: '/exchange', label: '거래소', requireAuth: false },
    { href: '/portfolio-recommendation', label: '포트폴리오 추천', requireAuth: false },
    { href: '/trends', label: '트렌드', requireAuth: false },
    { href: '/my-assets', label: '보유 자산', requireAuth: true },
    { href: '/history', label: '거래내역', requireAuth: true },
] as const;

interface AuthUser {
    id: string;
    email?: string;
}

function UserProfileDropdown({ authUser }: { authUser: AuthUser }) {
    const { user: dbUser, isLoading } = useUserForDropdown();

    if (isLoading) {
        return (
            <button className="hover-button flex items-center justify-center p-1 rounded-full outline-none">
                <CircleUserRound className='size-6 text-white opacity-50' />
            </button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="hover-button flex items-center justify-center p-1 rounded-full outline-none">
                    <CircleUserRound className='size-6 text-white' />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-64 glass-card border-white/20 backdrop-blur-md bg-white/10"
            >
                <DropdownMenuLabel>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                            <User className="size-5 text-description" />
                        </div>
                        <div className="flex flex-col">
                            <EditDisplayNameForm
                                currentName={dbUser?.nickname || '사용자'}
                                onSuccess={() => window.location.reload()} // 간단한 새로고침으로 변경
                            />
                            <span className="text-xs">
                                {authUser.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-200" />
                <DropdownMenuItem
                    onClick={() => {
                        const supabase = createBrowserSupabaseClient();
                        supabase.auth.signOut();
                    }}
                    className="hover:bg-white/10 cursor-pointer transition duration-200"
                >
                    <LogOut className="size-4 text-main" />
                    <span className="text-main">로그아웃</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function Navbar() {
    const [authUser, setAuthUser] = useState<null | AuthUser>(null);

    const supabase = createBrowserSupabaseClient();

    const pathname = usePathname();

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
            if (session?.user) {
                setAuthUser({
                    id: session.user.id,
                    email: session.user.email
                });
            } else {
                setAuthUser(null);
            }
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
                        const isDisabled = link.requireAuth && !authUser;

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
                    {authUser ? (
                        <ErrorBoundary fallback={<div>에러 발생</div>}>
                            <UserProfileDropdown authUser={authUser} />
                        </ErrorBoundary>
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