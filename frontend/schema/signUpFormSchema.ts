import { z } from 'zod';

/** 회원가입 폼 유효성 검증
 * @target email
 * @target password
 */
export const signUpFormSchema = z.object({
    email: z.string().min(1, '이메일을 입력해 주세요.').max(30, '이메일은 30자 이하로 입력해 주세요.').email('올바른 이메일 형식이 아닙니다.'),
    password: z.string().min(8, '비밀번호가 8자 이상이 되도록 해주세요.').refine(
        (password) => {
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            const hasNumber = /\d/.test(password);
            const hasLowercase = /[a-z]/.test(password);
            return hasSpecialChar && hasNumber && hasLowercase;
        },
        { message: '영문 소문자, 숫자, 특수문자를 포함해야 합니다.' }
    ),
});

export type SignUpFormSchemaType = z.infer<typeof signUpFormSchema>;