'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const LINKS = [
    { href: '/exchange', label: '거래소' },
    { href: '/auto-portfolio', label: '포트폴리오 추천' },
    { href: '/history', label: '거래내역' },
    { href: '/trends', label: '트렌드' },
    { href: '/my-assets', label: '보유 자산' },
    { href: '/my-profile', label: '마이페이지' },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="nav-layout bg-main">
            <div className='nav-contents'>
                <div className="flex items-center gap-4">
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
                    {LINKS.map(link => {
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center"
                            >
                                <span className={`text-nav-default ${pathname.includes(link.href) ? 'text-white opacity-100' : ''}`}>{link.label}</span>
                            </Link>
                        );
                    })}
                </div>
                <div className='flex items-center gap-4'>
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
                </div>
            </div>
        </nav >
    );
}