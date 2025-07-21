import { googleOauth } from '@/utils/supabase/googleOauth';
import Button from '@/components/shared/Button';
import Image from 'next/image';

export default function GoogleOauthButton() {
    return (
        <Button
            onClick={googleOauth}
            variant='default'
            customClassName='bg-blue-500 flex justify-center items-center gap-4'
        >
            <Image
                src='https://res.cloudinary.com/dbvzbdffi/image/upload/v1753068856/google_fytopu.avif'
                alt='구글 로고 사진'
                width={20}
                height={20} />
            <span className='text-button-text'>Google로 로그인</span>
        </Button>
    );
}

