import { z } from 'zod';

/** 
 * 로그인 폼 유효성 테스트
 */
export const signInFormSchema = z.object({
    email: z.string().email('올바른 이메일 형식이 아닙니다.'),
    password: z
        .string()
        .min(8, '비밀번호는 8자 이상이어야 합니다.')
});

export type SignInFormSchemaType = z.infer<typeof signInFormSchema>;