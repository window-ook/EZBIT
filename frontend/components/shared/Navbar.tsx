'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUserDataForDropdown } from '@/hooks/supabase/useUserData';
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
import { CircleUserRound, LogOut, User, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import EditNickNameForm from '@/components/shared/EditNickNameForm';

const LINKS = [
    { href: '/exchange', label: '거래소', requireAuth: false },
    { href: '/portfolio-pilot', label: '포트폴리오 파일럿', requireAuth: false },
    { href: '/trends', label: '트렌드', requireAuth: false },
    { href: '/my-assets', label: '보유 자산', requireAuth: true },
    { href: '/history', label: '거래내역', requireAuth: true },
] as const;

interface IAuthUser {
    id: string;
    email?: string;
}

const UserProfileDropdown = ({ authUser }: { authUser: IAuthUser }) => {
    const { user: dbUser, isLoading } = useUserDataForDropdown();

    if (isLoading) {
        return (
            <button className="hover-button flex items-center justify-center p-1 rounded-full outline-none">
                <CircleUserRound className='size-5 sm:size-6 text-white opacity-50' />
            </button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button aria-label='사용자 프로필 버튼' className="hover-button flex items-center justify-center p-1 rounded-full outline-none">
                    <CircleUserRound className='size-5 sm:size-6 text-white' />
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
                            <EditNickNameForm
                                currentName={dbUser?.nickname || '사용자'}
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
};

const MobileMenuDropdown = ({ authUser }: { authUser: IAuthUser | null }) => {
    const pathname = usePathname();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="hover-button md:hidden flex items-center justify-center p-2 rounded-md outline-none">
                    <Menu className='size-5 text-white' />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-56 glass-card border-white/20 backdrop-blur-md bg-white/10"
            >
                <DropdownMenuLabel className="font-bold text-main-dark">
                    메뉴
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-200" />

                {/* 내비게이션 링크들 */}
                {LINKS.map(link => {
                    const isActive = pathname.includes(link.href);
                    const isDisabled = link.requireAuth && !authUser;

                    if (isDisabled) {
                        return (
                            <DropdownMenuItem
                                key={link.href}
                                disabled
                                className="opacity-50 cursor-not-allowed"
                            >
                                <span className="text-white">{link.label}</span>
                            </DropdownMenuItem>
                        );
                    }

                    return (
                        <DropdownMenuItem key={link.href} asChild>
                            <Link
                                href={link.href}
                                className={`w-full cursor-pointer hover:bg-white/10 transition duration-200 ${isActive ? 'bg-white/5' : ''
                                    }`}
                            >
                                <span>{link.label}</span>
                            </Link>
                        </DropdownMenuItem>
                    );
                })}

                <DropdownMenuSeparator className="bg-slate-200" />

                {/* 인증 관련 버튼들 */}
                {!authUser && (
                    <>
                        <DropdownMenuItem asChild>
                            <Link
                                href="/signin"
                                className="w-full cursor-pointer hover:bg-white/10 transition duration-200"
                            >
                                <span className="font-bold text-main-dark">로그인</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href="/signup"
                                className="w-full cursor-pointer hover:bg-white/10 transition duration-200"
                            >
                                <span className="font-bold text-main-dark">회원가입</span>
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default function Navbar() {
    const [authUser, setAuthUser] = useState<null | IAuthUser>(null);

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
            <div className='nav-contents px-4 lg:px-0'>
                {/* 왼쪽 */}
                <div className="flex items-center gap-6">
                    {/* 로고 */}
                    <div className='flex items-center gap-2'>
                        <Image
                            src="https://res.cloudinary.com/dbvzbdffi/image/upload/v1751333125/logo_ejvz9u.avif"
                            alt="EZBIT Logo"
                            width={100}
                            height={100}
                            className="size-6 sm:size-8 rounded-md"
                        />
                        <h1 className="text-lg sm:text-2xl text-white font-bold">EZBIT</h1>
                    </div>

                    {/* 데스크톱 링크 버튼들 (md 이상에서만 표시) */}
                    <div className="hidden md:flex items-center gap-6">
                        {LINKS.map(link => {
                            const isActive = pathname.includes(link.href);
                            const isDisabled = link.requireAuth && !authUser;

                            if (isDisabled) {
                                return (
                                    <span
                                        key={link.href}
                                        tabIndex={-1}
                                        aria-disabled="true"
                                        className={`flex items-center text-white opacity-50 cursor-not-allowed text-sm lg:text-base`}
                                    >
                                        {link.label}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center text-white text-sm lg:text-base transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-70 hover:opacity-90'}`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* 오른쪽 */}
                <div className='flex items-center gap-2 sm:gap-4'>
                    {/* 모바일 햄버거 메뉴 */}
                    <MobileMenuDropdown authUser={authUser} />

                    {/* 데스크톱 인증 버튼들 (md 이상에서만 표시) */}
                    <div className="hidden md:flex items-center gap-4">
                        {authUser ? (
                            <ErrorBoundary fallback={<div>에러 발생</div>}>
                                <UserProfileDropdown authUser={authUser} />
                            </ErrorBoundary>
                        ) : (
                            <>
                                <Link
                                    href="/signin"
                                    className="text-white font-bold text-sm lg:text-base transition-opacity duration-200 hover:opacity-80"
                                >
                                    로그인
                                </Link>
                                <Link
                                    href="/signup"
                                    className="text-white font-bold text-sm lg:text-base transition-opacity duration-200 hover:opacity-80"
                                >
                                    회원가입
                                </Link>
                            </>
                        )}
                    </div>

                    {/* 모바일에서 로그인한 사용자 프로필 (md 미만에서만 표시) */}
                    {authUser && (
                        <div className="md:hidden">
                            <ErrorBoundary fallback={<div>에러 발생</div>}>
                                <UserProfileDropdown authUser={authUser} />
                            </ErrorBoundary>
                        </div>
                    )}
                </div>
            </div>
        </nav >
    );
}