import { Card } from '@/components/shadcn-ui/card';
import { Metadata } from 'next';
import Button from '@/components/shared/Button';

export const metadata: Metadata = {
    title: '마이 프로필 : EZBIT',
    description: '마이 프로필 페이지 입니다',
};

export default function MyProfilePage() {
    // 닉네임 변경 클릭시, 이름 span이 input으로 변경되고 버튼은 '변경하기'로 변경된다.
    return (
        <main className="contents-container h-150 w-full flex justify-center items-center">
            <Card className='p-4'>
                <h2 className='text-2xl font-bold text-main'>마이 프로필</h2>
                <div className='flex items-center gap-4'>
                    <div className='flex flex-col'>
                        <span className='text-xl text-gray-500'>이름</span>
                        <span className='text-xl text-gray-500'>test@example.com</span>
                    </div>
                </div>
                <Button customClassName='hover:bg-main-dark transition-all duration-150'>닉네임 변경</Button>
            </Card>
        </main>
    );
}