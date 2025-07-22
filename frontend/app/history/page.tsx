import { Metadata } from 'next';
import { getHistory } from '@/actions/supabase/getHistory';
import { TABLE_CELL_STYLE } from '@/utils/shared/styles';
import { Card, CardContent } from '@/components/shadcn-ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn-ui/table';
import { formatKSTDate } from '@/utils/shared/date';

export const metadata: Metadata = {
    title: '거래내역 : EZBIT',
    description: '거래 내역을 확인하세요',
    keywords: ['거래 내역', 'EZBIT', '거래', '주문', '체결 내역'],
};

export default async function HistoryPage() {
    const history = await getHistory();

    return (
        <main className="w-full h-full">
            <Card aria-label='거래내역 테이블'>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className={TABLE_CELL_STYLE}>코인</TableHead>
                                <TableHead className={TABLE_CELL_STYLE}>종류</TableHead>
                                <TableHead className={TABLE_CELL_STYLE}>거래수량</TableHead>
                                <TableHead className={TABLE_CELL_STYLE}>거래단가</TableHead>
                                <TableHead className={TABLE_CELL_STYLE}>거래금액</TableHead>
                                <TableHead className={TABLE_CELL_STYLE}>주문시간</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.map((holding, index) => (
                                <TableRow key={index} className="text-xs">
                                    <TableCell className={TABLE_CELL_STYLE}>{holding.market}</TableCell>
                                    <TableCell className={`${TABLE_CELL_STYLE} ${holding.order_type === 'BID' ? 'text-positive' : 'text-negative'}`}>{holding.order_type === 'BID' ? '매수' : '매도'}</TableCell>
                                    <TableCell className={TABLE_CELL_STYLE}>{holding.volume}</TableCell>
                                    <TableCell className={TABLE_CELL_STYLE}>{holding.trade_price.toLocaleString()}</TableCell>
                                    <TableCell className={TABLE_CELL_STYLE}>{holding.total_amount.toLocaleString()}</TableCell>
                                    <TableCell className={TABLE_CELL_STYLE}>{formatKSTDate(holding.created_at)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    );
}