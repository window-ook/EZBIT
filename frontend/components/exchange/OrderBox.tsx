'use client';

import { useState, useEffect, useContext } from 'react';
import { TickerContext } from '@/providers/TickerProvider';
import { useRouter } from 'next/navigation';
import { useCreateBid } from '@/hooks/supabase/useCreateBid';
import { useCreateAsk } from '@/hooks/supabase/useCreateAsk';
import { useHoldingsConditional } from '@/hooks/supabase/useHoldings';
import { useUser } from '@/hooks/supabase/useUser';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { askSchema, AskSchemaType, bidSchema, BidSchemaType } from '@/schema/exchange/orderSchema';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { Table, TableBody, TableCell, TableRow } from '@/components/shadcn-ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn-ui/tabs';
import { Card } from '@/components/shadcn-ui/card';
import InputField from '@/components/shared/InputField';
import Button from '@/components/shared/Button';

type FormType = BidSchemaType | AskSchemaType;

/** 탭 목록 */
const TABS = [
    { key: 'bid', label: '매수' },
    { key: 'ask', label: '매도' },
] as const;

/** 동적 스키마 적용: 매수/매도 주문 구분 */
const getSchema = (tab: (typeof TABS)[number]['key']) => tab === 'ask' ? askSchema : bidSchema;

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

const MIN_TOTAL = 5000; // 최소 주문 금액
const DEFAULT_PRICE = 0; // 기본 가격
const DEFAULT_QUANTITY = 0; // 기본 수량

const ASK_TAB_LABEL_STYLE = 'text-xs text-description';
const INPUT_FIELD_LABEL_STYLE = 'w-24 text-description text-sm';

export default function OrderBox() {
    const [tab, setTab] = useState<(typeof TABS)[number]['key']>('bid');
    const [isSignIn, setIsSignIn] = useState(false);

    const { currentTicker, krwNames } = useContext(TickerContext);

    const { user } = useUser();
    const { holdings } = useHoldingsConditional(!!user); // 사용자가 있을 때만 실행
    const { requestBid } = useCreateBid();
    const { requestAsk } = useCreateAsk();

    const router = useRouter();

    const supabase = createBrowserSupabaseClient();

    const {
        control,
        setValue,
        watch,
        handleSubmit,
        reset,
        formState: { errors, touchedFields },
    } = useForm<FormType>({
        resolver: zodResolver(getSchema(tab)),
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
    const bidableKRW = user?.holding_krw ?? 0;
    const askableVolume = holdings && currentTicker
        ? holdings.find(h => h.market === currentTicker.market)?.total_bid_volume ?? 0
        : 0;
    const canBidOrder = total >= MIN_TOTAL && total <= bidableKRW;
    const canAskOrder = quantity > 0 && quantity <= askableVolume;

    // 로그인 상태 동기화
    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getUser();
            setIsSignIn(!!data?.user?.id);
        })();
    }, [supabase]);

    // 주문가격 현재가(시장가) 동기화: 매수/매도 동일
    useEffect(() => {
        setValue('price', currentTicker?.trade_price ?? 0);
    }, [currentTicker, setValue]);

    // 주문총액 동기화
    useEffect(() => {
        setValue('total', total, { shouldValidate: true });
    }, [price, quantity, setValue, total]);

    // 탭 변경 시 폼 초기화
    useEffect(() => {
        reset({
            price: DEFAULT_PRICE,
            quantity: DEFAULT_QUANTITY,
            total: DEFAULT_PRICE * DEFAULT_QUANTITY,
        });
    }, [tab, reset]);

    // 주문수량 숫자 변환
    const changeToNumber = (val: string, type: 'quantity') => {
        const num = Number(val.replace(/[^\d.]/g, ''));
        setValue(type, isNaN(num) ? 0 : num);
    };

    const onSubmit = async (data: BidSchemaType) => {
        try {
            if (tab === 'bid') {
                await requestBid(
                    {
                        market: currentTicker?.market,
                        quantity: data.quantity,
                        price: data.price,
                        total: data.total
                    }
                );

                alert(`${krwNames[currentTicker?.market]} 매수 체결: KRW ${data.total.toLocaleString()}`);

                reset({
                    price: DEFAULT_PRICE,
                    quantity: DEFAULT_QUANTITY,
                    total: 0,
                });
            } else {
                const avgBidPrice = holdings?.find(h => h.market === currentTicker?.market)?.avg_bid_price ?? 0;
                const original_amount = avgBidPrice * data.quantity;

                await requestAsk(
                    {
                        market: currentTicker?.market,
                        quantity: data.quantity,
                        price: data.price,
                        total: data.total,
                        original_amount: original_amount
                    }
                );

                alert(`${krwNames[currentTicker?.market]} 매도 체결: KRW ${data.total.toLocaleString()}`);

                reset({
                    price: DEFAULT_PRICE,
                    quantity: DEFAULT_QUANTITY,
                    total: 0,
                });
            }
        } catch (e) {
            const err = e as Error;
            alert(err.message);
        }
    };

    const handleSignin = () => router.push('/signin');

    return (
        <Card className="w-full h-[26rem] mx-auto p-3 overflow-y-scroll">
            <div className='flex justify-between items-center'>
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
                <button type='button' className='px-4 py-1 rounded-md border border-slate-400 bg-slate-100 cursor-pointer'>올인</button>
            </div>

            {/* 매수 탭*/}
            {tab === 'bid' && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <p className={`${ASK_TAB_LABEL_STYLE} pl-2`}>최소주문금액: {MIN_TOTAL.toLocaleString()} KRW</p>
                        <p className={ASK_TAB_LABEL_STYLE}>주문가능: {bidableKRW.toLocaleString()} KRW</p>
                    </div>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className={INPUT_FIELD_LABEL_STYLE}>매수가격 (KRW)</TableCell>
                                <TableCell className='w-[80%]'>
                                    <div className="flex items-center gap-2">
                                        <Controller
                                            name="price"
                                            control={control}
                                            render={({ field }) => (
                                                <InputField
                                                    aria-label="매수가격"
                                                    id="price"
                                                    type="text"
                                                    readOnly
                                                    min={0}
                                                    step={getPriceStep(price)}
                                                    value={field.value?.toLocaleString() ?? ''}
                                                    disabled={true}
                                                />
                                            )}
                                        />
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
                                                onChange={e => changeToNumber(e.target.value, 'quantity')}
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
                        type={isSignIn ? 'submit' : 'button'}
                        onClick={!isSignIn ? handleSignin : undefined}
                        disabled={!canBidOrder}
                        customClassName={`${canBidOrder ? 'bg-main hover:bg-main/90' : 'bg-gray-300 cursor-not-allowed'}`}
                    >
                        {isSignIn ? '주문하기' : '로그인'}
                    </Button>

                    {total > bidableKRW && <p className="text-xs text-red-500 text-right pr-2">주문가능 금액을 초과했습니다.</p>}
                </form>
            )}

            {/* 매도 탭*/}
            {tab === 'ask' && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-2">
                    <div className="flex justify-end items-center">
                        <p className={ASK_TAB_LABEL_STYLE}>주문가능 수량: {askableVolume.toLocaleString()}</p>
                    </div>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className={INPUT_FIELD_LABEL_STYLE}>매도가격 (KRW)</TableCell>
                                <TableCell className='w-[80%]'>
                                    <div className="flex items-center gap-2">
                                        <Controller
                                            name="price"
                                            control={control}
                                            render={({ field }) => (
                                                <InputField
                                                    aria-label="매수가격"
                                                    id="price"
                                                    type="text"
                                                    readOnly
                                                    min={0}
                                                    step={getPriceStep(price)}
                                                    value={field.value?.toLocaleString() ?? ''}
                                                    disabled={true}
                                                />
                                            )}
                                        />
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
                                                onChange={e => changeToNumber(e.target.value, 'quantity')}
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
                        type={isSignIn ? 'submit' : 'button'}
                        onClick={!isSignIn ? handleSignin : undefined}
                        disabled={!canAskOrder}
                        customClassName={`${canAskOrder ? 'bg-main hover:bg-main/90' : 'bg-gray-300 cursor-not-allowed'}`}
                    >
                        {isSignIn ? '주문하기' : '로그인'}
                    </Button>

                    {quantity > askableVolume && <p className="text-xs text-red-500 text-right pr-2">주문가능 수량을 초과했습니다.</p>}
                </form>
            )}
        </Card>
    );
}