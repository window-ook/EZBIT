import { getHistory } from '@/actions/supabase/getHistory';
import { Card, CardContent } from '@/components/shadcn-ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn-ui/table';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '거래내역 : EZBIT',
    description: '거래 내역을 확인하세요',
    keywords: ['거래 내역', 'EZBIT', '거래', '주문', '체결 내역'],
};

export default async function HistoryPage() {
    const history = await getHistory();

    return (
        <main className="w-full h-full">
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/7 text-center">종목</TableHead>
                                <TableHead className="w-1/7 text-center">마켓</TableHead>
                                <TableHead className="w-1/7 text-center">거래수량</TableHead>
                                <TableHead className="w-1/7 text-center">거래단가</TableHead>
                                <TableHead className="w-1/7 text-center">거래금액</TableHead>
                                <TableHead className="w-1/7 text-center">주문시간</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.map((holding, index) => (
                                <TableRow key={index} className="text-xs">
                                    <TableCell className="w-1/7 text-center">{holding.market}</TableCell>
                                    <TableCell className="w-1/7 text-center">{holding.market}</TableCell>
                                    <TableCell className="w-1/7 text-center">{holding.volume}</TableCell>
                                    <TableCell className="w-1/7 text-center">{holding.trade_price.toLocaleString()}</TableCell>
                                    <TableCell className="w-1/7 text-center">{holding.total_amount.toLocaleString()}</TableCell>
                                    <TableCell className="w-1/7 text-center">{holding.created_at}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    );
}