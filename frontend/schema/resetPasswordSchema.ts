import { z } from 'zod';

/** 
 * 비밀번호 재설정 요청 폼 유효성 테스트
 */
export const resetPasswordRequestSchema = z.object({
    email: z.string().email('올바른 이메일 형식이 아닙니다.'),
});

/** 
 * 새 비밀번호 설정 폼 유효성 테스트
 */
export const resetPasswordCompleteSchema = z.object({
    newPassword: z
        .string()
        .min(8, '비밀번호는 8자 이상이어야 합니다.')
        .max(100, '비밀번호는 100자 이하여야 합니다.'),
    confirmPassword: z
        .string()
        .min(8, '비밀번호는 8자 이상이어야 합니다.')
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
});

export type ResetPasswordRequestSchemaType = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordCompleteSchemaType = z.infer<typeof resetPasswordCompleteSchema>; 