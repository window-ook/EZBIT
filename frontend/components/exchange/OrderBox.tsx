'use client';

import { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSaveUserData } from '@/hooks/supabase/useSaveUserData';
import { useCreateBid } from '@/hooks/supabase/useCreateBid';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bidSchema, BidSchemaType } from '@/schema/exchange/bidSchema';
import { TickerContext } from '@/providers/TickerProvider';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { ISupabaseUser } from '@/types/supabase/user';
import { Card } from '@/components/shadcn-ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/shadcn-ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn-ui/tabs';
import { CircleMinus, CirclePlus } from 'lucide-react';
import InputField from '@/components/shared/InputField';
import Button from '@/components/shared/Button';

const TABS = [
    { key: 'ask', label: '매수' },
    { key: 'bid', label: '매도' },
    { key: 'easy', label: '간편 주문' },
] as const;

const ASK_TAB_LABEL_STYLE = 'text-xs text-description';
const INPUT_FIELD_LABEL_STYLE = 'w-24 text-description text-sm';

/**
 * 가격에 따라 증감 단위를 반환하는 헬퍼 함수
 * @param price 현재 가격
 * @returns 증감 단위
 */
const getPriceStep = (price: number): number => {
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

export default function OrderBox({ user }: { user: ISupabaseUser | null }) {
    const [tab, setTab] = useState<(typeof TABS)[number]['key']>('ask');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { currentTicker, krwNames } = useContext(TickerContext);

    const { cachedUser } = useSaveUserData(user);

    const { requestBid } = useCreateBid();

    const prevMarketRef = useRef<string | undefined>(undefined);

    const router = useRouter();

    const supabase = createBrowserSupabaseClient();

    const {
        control,
        setValue,
        watch,
        handleSubmit,
        formState: { errors, touchedFields },
    } = useForm<BidSchemaType>({
        resolver: zodResolver(bidSchema),
        mode: 'onSubmit',
        defaultValues: {
            price: DEFAULT_PRICE,
            quantity: DEFAULT_QUANTITY,
            total: DEFAULT_PRICE * DEFAULT_QUANTITY,
        },
    });

    const price = watch('price');
    const quantity = watch('quantity');
    const total = price * quantity;
    const availableKRW = cachedUser?.holding_krw ?? 0;
    const canOrder = total >= MIN_TOTAL && total <= availableKRW;

    // 로그인 상태 동기화
    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getUser();
            setIsLoggedIn(!!data?.user?.id);
        })();
    }, [supabase]);


    // 매수가격 동기화: 초기값 0일 때만 현재가로 세팅
    useEffect(() => {
        if (currentTicker?.market && prevMarketRef.current !== currentTicker.market) {
            if (currentTicker.trade_price) setValue('price', currentTicker.trade_price);
            prevMarketRef.current = currentTicker.market;
        }
    }, [currentTicker, setValue]);

    // 주문총액 동기화
    useEffect(() => {
        setValue('total', total, { shouldValidate: true });
    }, [price, quantity, setValue, total]);

    // 매수가격 증감 핸들러
    const handlePriceChange = (diff: number) => setValue('price', Math.max(0, price + diff));

    // 주문수량 입력 핸들러
    const handleNumberChange = (val: string) => {
        const num = Number(val.replace(/[^\d.]/g, ''));
        setValue('quantity', isNaN(num) ? 0 : num);
    };

    const handleSignin = () => router.push('/signin');

    // 매도/매수 주문 구분 추후 구현
    const onSubmit = async (data: BidSchemaType) => {
        try {
            await requestBid(
                {
                    market: currentTicker?.market,
                    quantity: data.quantity,
                    price: data.price,
                    total: data.total
                }
            );

            alert(`${krwNames[currentTicker?.market]} 매수 체결: KRW ${data.total.toLocaleString()}`);

            setValue('price', DEFAULT_PRICE);
            setValue('quantity', DEFAULT_QUANTITY);
            setValue('total', 0);
        } catch (e) {
            const err = e as Error;
            alert(err.message || '매수 주문에 실패했습니다.');
        }
    };

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
            {tab === 'ask' && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <p className={`${ASK_TAB_LABEL_STYLE} pl-2`}>최소주문금액: {MIN_TOTAL.toLocaleString()} KRW</p>
                        <p className={ASK_TAB_LABEL_STYLE}>주문가능: {availableKRW.toLocaleString()} KRW</p>
                    </div>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className={INPUT_FIELD_LABEL_STYLE}>매수가격 (KRW)</TableCell>
                                <TableCell className='w-[80%]'>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handlePriceChange(-getPriceStep(price))}
                                            className="hover-button rounded font-bold">
                                            <CircleMinus />
                                        </button>
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
                                        <button
                                            type="button"
                                            onClick={() => handlePriceChange(getPriceStep(price))}
                                            className="hover-button rounded font-bold">
                                            <CirclePlus />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={INPUT_FIELD_LABEL_STYLE}>주문수량 ({currentTicker?.market?.slice(4) ?? ''})</TableCell>
                                <TableCell className='w-[80%]'>
                                    <Controller
                                        name="quantity"
                                        control={control}
                                        render={({ field }) => (
                                            <InputField
                                                {...field}
                                                aria-label="주문수량"
                                                id="quantity"
                                                type="number"
                                                step={0.0000001}
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
                                <TableCell className={INPUT_FIELD_LABEL_STYLE}>주문총액 (KRW)</TableCell>
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
                                                isError={touchedFields.total ? errors.total?.message : undefined}
                                            />
                                        )}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Button
                        type={isLoggedIn ? 'submit' : 'button'}
                        onClick={!isLoggedIn ? handleSignin : undefined}
                        disabled={!canOrder}
                        customClassName={`${canOrder ? 'bg-main hover:bg-main/90' : 'bg-gray-300 cursor-not-allowed'}`}
                    >
                        {isLoggedIn ? '주문하기' : '로그인'}
                    </Button>

                    {total > availableKRW && <p className="text-xs text-red-500 text-right pr-2">주문가능 금액을 초과했습니다.</p>}
                </form>
            )}

            {/* 매도, 간편 주문 탭은 추후 구현 */}
            {tab !== 'ask' && <div className="pt-30 text-center text-gray-400">준비 중입니다.</div>}
        </Card>
    );
}