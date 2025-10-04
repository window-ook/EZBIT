import { googleOauth } from '@/utils/supabase/googleOauth';
import { IMAGE_PATHS } from '@/lib/imagePaths';
import Button from '@/components/shared/Button';
import Image from 'next/image';

export default function GoogleOauthButton() {
    return (
        <Button
            onClick={googleOauth}
            variant='default'
            customClassName='bg-blue-500 flex justify-center items-center gap-4 hover:brightness-110'
        >
            <Image
                src={IMAGE_PATHS.GOOGLE_LOGO}
                alt='구글 로고'
                width={20}
                height={20} />
            <span className='text-button-text'>Google 로그인</span>
        </Button>
    );
}