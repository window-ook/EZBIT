import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '마이 프로필 : EZBIT',
    description: '마이 프로필 페이지 입니다',
};

export default function MyProfilePage() {
    return (
        <h1>MyProfile</h1>
    );
}