import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { z } from 'zod';


/** 닉네임 변경 폼 유효성 검증
 * @target nickname
 */
export const changeNickNameSchema = z.object({
    nickname: z
        .string()
        .min(1, '닉네임은 1자 이상이어야 합니다.')
        .max(20, '닉네임은 20자 이하여야 합니다.')
        .regex(/^[a-zA-Z0-9가-힣]+$/, '특수문자는 사용할 수 없습니다.')
        .refine(async (data) => {
            const supabase = createBrowserSupabaseClient();
            const { data: existingNickname } = await supabase.from('users').select('nickname').eq('nickname', data).single();
            return existingNickname === null;
        }, {
            message: '이미 존재하는 닉네임입니다.',
            path: ['nickname'],
        })
        .refine((data) => data.trim() !== '', {
            message: '닉네임은 비어있을 수 없습니다.',
            path: ['nickname'],
        }),
});

export type ChangeNickNameSchemaType = z.infer<typeof changeNickNameSchema>;
