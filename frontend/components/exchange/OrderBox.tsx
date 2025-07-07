'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderBoxSchema, OrderBoxFormValues } from '@/schema/orderBoxSchema';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { TickerContext } from '@/providers/TickerProvider';
import { Card } from '@/components/shadcn-ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/shadcn-ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn-ui/tabs';
import { CircleMinus, CirclePlus } from 'lucide-react';
import InputField from '@/components/shared/InputField';
import Button from '@/components/shared/Button';

const TABS = [
    { key: 'buy', label: '매수' },
    { key: 'sell', label: '매도' },
    { key: 'easy', label: '간편주문' },
] as const;

/**
 * 가격에 따라 증감 단위를 반환하는 헬퍼 함수
 * @param price 현재 가격
 * @returns 증감 단위
 */
const getPriceStep = (price: number): number => {
    // 가격 구간별 증감 단위 상수
    const STEP_10000 = 1000 as const;
    const STEP_1000 = 100 as const;
    const STEP_500 = 1 as const;
    const STEP_100 = 0.5 as const;
    const STEP_UNDER_100 = 0.1 as const;

    if (price >= 10000) return STEP_10000;
    if (price >= 1000) return STEP_1000;
    if (price >= 500) return STEP_500;
    if (price >= 100) return STEP_100;
    return STEP_UNDER_100;
};

const MIN_TOTAL = 5000;
const DEFAULT_PRICE = 0;
const DEFAULT_QUANTITY = 0;

export default function OrderBox() {
    const [tab, setTab] = useState<(typeof TABS)[number]['key']>('buy');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { currentTicker, krwNames } = useContext(TickerContext);

    const router = useRouter();

    const supabase = createBrowserSupabaseClient();

    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getUser();
            setIsLoggedIn(!!data?.user?.id);
        })();
    }, [supabase]);

    const {
        control,
        setValue,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<OrderBoxFormValues>({
        resolver: zodResolver(orderBoxSchema),
        mode: 'onChange',
        defaultValues: {
            price: DEFAULT_PRICE,
            quantity: DEFAULT_QUANTITY,
            total: 0,
        },
    });

    // 실시간 값 동기화
    const price = watch('price');
    const quantity = watch('quantity');
    const total = price * quantity;

    // 주문총액 자동 반영
    useEffect(() => {
        setValue('total', total, { shouldValidate: true });
    }, [price, quantity, setValue, total]);

    useEffect(() => {
        setValue('price', currentTicker?.trade_price ?? 0);
    }, [currentTicker, setValue]);

    // 매수 가격 증감 핸들러
    const handlePriceChange = (diff: number) => setValue('price', Math.max(0, price + diff));

    // 주문수량 입력 핸들러 (숫자만)
    const handleNumberChange = (val: string) => {
        const num = Number(val.replace(/[^\d.]/g, ''));
        setValue('quantity', isNaN(num) ? 0 : num);
    };

    // 로그인 버튼 클릭
    const handleLogin = () => router.push('/signin');

    // 주문 버튼 클릭
    const onSubmit = (data: OrderBoxFormValues) => alert(`${krwNames[currentTicker?.market]} 매수 체결: KRW ${data.total.toLocaleString()}`);

    return (
        <Card className="w-full h-[26rem] mx-auto p-3 overflow-y-scroll">
            {/* 탭 */}
            <Tabs>
                <TabsList>
                    {TABS.map(({ key, label }) => (
                        <TabsTrigger
                            key={key}
                            value={key}
                            className={`px-4 py-2 text-base font-bold border-b-2 transition-colors duration-200 ${tab === key ? 'border-main text-main' : 'border-transparent text-gray-500'}`}
                            onClick={() => setTab(key)}
                        >
                            {label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* 매수 탭만 구현 */}
            {tab === 'buy' && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-2">
                    <p className="pl-2 text-xs text-description">최소주문금액: {MIN_TOTAL.toLocaleString()} KRW</p>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="w-24 text-description text-sm">매수가격 (KRW)</TableCell>
                                <TableCell className='w-[80%]'>
                                    <div className="flex items-center gap-2">
                                        <button type="button" className="hover-button rounded font-bold" onClick={() => handlePriceChange(-getPriceStep(price))}><CircleMinus /></button>
                                        <Controller
                                            name="price"
                                            control={control}
                                            render={({ field }) => (
                                                <InputField
                                                    aria-label="매수가격"
                                                    id="price"
                                                    type="text"
                                                    min={0}
                                                    step={getPriceStep(price)}
                                                    value={field.value?.toLocaleString() ?? ''}
                                                    onChange={e => handleNumberChange(e.target.value)}
                                                    disabled={true}
                                                />
                                            )}
                                        />
                                        <button type="button" className="hover-button rounded font-bold" onClick={() => handlePriceChange(getPriceStep(price))}><CirclePlus /></button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-24 text-description text-sm">주문수량 ({currentTicker?.market?.slice(4) ?? ''})</TableCell>
                                <TableCell className='w-[80%]'>
                                    <Controller
                                        name="quantity"
                                        control={control}
                                        render={({ field }) => (
                                            <InputField
                                                {...field}
                                                aria-label="주문수량"
                                                type="text"
                                                min={0}
                                                value={Number(field.value)}
                                                onChange={e => handleNumberChange(e.target.value)}
                                                disabled={false}
                                                isError={errors.quantity?.message}
                                            />
                                        )}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-24 text-description text-sm">주문총액 (KRW)</TableCell>
                                <TableCell className='w-[80%]'>
                                    <Controller
                                        name="total"
                                        control={control}
                                        render={({ field }) => (
                                            <InputField
                                                {...field}
                                                aria-label="주문총액"
                                                type="number"
                                                value={field.value}
                                                readOnly
                                                disabled={false}
                                                isError={errors.total?.message}
                                            />
                                        )}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Button
                        type={isLoggedIn ? 'submit' : 'button'}
                        customClassName={`${total >= MIN_TOTAL ? 'bg-main hover:bg-main/90' : 'bg-gray-300 cursor-not-allowed'}`}
                        disabled={total < MIN_TOTAL}
                        onClick={!isLoggedIn ? handleLogin : undefined}
                    >
                        {isLoggedIn ? '주문하기' : '로그인'}
                    </Button>
                </form>
            )}

            {/* 매도/간편주문/거래내역 탭은 추후 구현 */}
            {tab !== 'buy' && <div className="pt-30 text-center text-gray-400">준비 중입니다.</div>}
        </Card>
    );
}