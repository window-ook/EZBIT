import { z } from 'zod';

/**
 * 매수 주문 폼 스키마
 */
export const orderBoxSchema = z.object({
    price: z
        .number({ invalid_type_error: '매수 가격은 숫자여야 합니다.' })
        .min(0, { message: '매수 가격은 0 이상이어야 합니다.' }),
    quantity: z
        .number({ invalid_type_error: '주문수량은 숫자여야 합니다.' })
        .min(0, { message: '주문수량은 0 이상이어야 합니다.' }),
    total: z
        .number({ invalid_type_error: '주문총액은 숫자여야 합니다.' })
        .min(5000, { message: '최소 5,000원 이상이어야 합니다.' }),
});

export type OrderBoxFormValues = z.infer<typeof orderBoxSchema>; 