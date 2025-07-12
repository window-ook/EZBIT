import { z } from 'zod';

/**
 * 매수 주문 유효성 검증
 * @target price
 * @target quantity
 * @target total
 */
export const bidSchema = z.object({
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

export type BidSchemaType = z.infer<typeof bidSchema>;

/**
 * 매도 주문 유효성 검증
 * @target price
 * @target quantity
 * @target total
 */
export const askSchema = z.object({
    price: z
        .number({ invalid_type_error: '매도 가격은 숫자여야 합니다.' })
        .min(0, { message: '매도 가격은 0 이상이어야 합니다.' }),
    quantity: z
        .number({ invalid_type_error: '주문수량은 숫자여야 합니다.' })
        .min(0, { message: '주문수량은 0 이상이어야 합니다.' }),
    total: z
        .number({ invalid_type_error: '주문총액은 숫자여야 합니다.' })
});

export type AskSchemaType = z.infer<typeof askSchema>; 